import { Request, Response } from "express";
import prisma from "../config/prisma";
import { User } from "@prisma/client";
import s3Client from "../config/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/customError";
import { NextFunction } from "express-serve-static-core";
import { INVALID_AUTHORIZATION } from "../utils/errorConstants";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { generateRandomName } from "./fileController";

const getFolders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User)?.id || null;

    if (!userId) {
      return next(
        new CustomError(
          INVALID_AUTHORIZATION,
          "You do not have permissions to access this resource.",
          403
        )
      );
    }

    const folders = await prisma.folder.findMany({
      where: { userId: userId },
      include: { files: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(folders);
  }
);

const postFolderCreate = asyncHandler(async (req: Request, res: Response) => {
  const { folderName } = req.body;
  const userId = (req.user as User)?.id || null;
  const newFolder = await prisma.folder.create({
    data: { name: folderName, userId: userId },
  });
  res.json(newFolder);
});

const getFolderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const userId = (req.user as User).id;
    const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY || "";
    const keyPairId = process.env.KEY_PAIR_ID || "";

    const folder = await prisma.folder.findUnique({
      where: { id: folderId, userId: userId },
      include: { files: true },
    });

    if (!folder) {
      next(new CustomError(300, "Folder not found", 404));
      return;
    }

    for (const file of folder.files) {
      const isExpired =
        !file.signedUrl || !file.expiresAt || file.expiresAt < new Date();

      if (isExpired) {
        // Url expires in 24 hours
        const expiresDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
        const signedUrl = getSignedUrl({
          url: `${process.env.CLOUDFRONT_URL}/${file.name}`,
          dateLessThan: expiresDate.toISOString(),
          privateKey: privateKey,
          keyPairId: keyPairId,
        });

        file.signedUrl = signedUrl;

        await prisma.file.update({
          where: { id: file.id },
          data: {
            signedUrl: signedUrl,
            expiresAt: expiresDate,
          },
        });
      }
    }

    res.json(folder);
  }
);

const patchFolderUpdate = asyncHandler(async (req: Request, res: Response) => {
  const folderId = Number(req.params.folderId);
  const userId = (req.user as User)?.id;
  const { folderName, expiresAt } = req.body;

  const updateData: Record<string, any> = {};

  if (folderName) updateData.name = folderName;
  if (expiresAt) {
    updateData.expiresAt = new Date(Date.now() + Number(expiresAt));
    updateData.folderUrl = `http://localhost:5173/share/${folderId}`;
  }

  const updatedFolder = await prisma.folder.update({
    where: { id: folderId, userId: userId },
    data: updateData,
  });
  res.json(updatedFolder);
});

const deleteFolderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const userId = (req.user as User)?.id;
    const folder = await prisma.folder.findUnique({
      where: { id: folderId, userId: userId },
    });

    if (!folder) {
      next(new CustomError(300, "Folder not found", 404));
      return;
    }

    const files = await prisma.file.findMany({ where: { folderId: folderId } });

    for (const file of files) {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.name,
      };
      const command = new DeleteObjectCommand(deleteParams);
      await s3Client.send(command);
    }

    await prisma.$transaction([
      prisma.file.deleteMany({ where: { folderId } }),
      prisma.folder.delete({ where: { id: folderId } }),
    ]);

    res.json("Successfully deleted folder");
  }
);

const getPublicFolder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (!folder?.expiresAt || !folder.folderUrl) {
      return next(
        new CustomError(300, "This folder is not publicably viewable", 404)
      );
    }

    if (folder.expiresAt < new Date(Date.now())) {
      return next(
        new CustomError(300, "This folder's url is no longer valid.", 404)
      );
    }

    res.json([folder]);
  }
);

export {
  getFolders,
  postFolderCreate,
  getFolderById,
  patchFolderUpdate,
  deleteFolderById,
  getPublicFolder,
};
