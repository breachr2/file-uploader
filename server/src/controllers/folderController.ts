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
    
    if (folder.expiresAt && folder.expiresAt < new Date()) {
      await prisma.folder.update({
        where: { id: folderId },
        data: { folderUrl: null, expiresAt: null },
      });
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
  const { folderName } = req.body;

  const updatedFolder = await prisma.folder.update({
    where: { id: folderId, userId: userId },
    data: { name: folderName },
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
      return next(new CustomError(300, "Folder not found", 404));
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

const putFolderUpdatePublic = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const userId = (req.user as User)?.id;
    const { expiresValue } = req.body;

    if (!expiresValue) {
      return next(new CustomError(305, "Please provide an expires date.", 400));
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: folderId, userId: userId },
      data: {
        expiresAt: new Date(Date.now() + Number(expiresValue) * 1000),
        folderUrl: `http://localhost:5173/share/${folderId}`,
      },
    });

    res.json(updatedFolder);
  }
);

export {
  getFolders,
  postFolderCreate,
  getFolderById,
  patchFolderUpdate,
  deleteFolderById,
  putFolderUpdatePublic,
};
