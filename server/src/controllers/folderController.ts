import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/customError";
import { User } from "@prisma/client";
import { getSignedCloudFrontUrl } from "../services/cloudFrontService";
import { deleteFileFromS3 } from "../services/s3Service";

const getFolders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User).id;
  const folders = await prisma.folder.findMany({
    where: { userId: userId },
    include: { files: true },
    orderBy: { createdAt: "asc" },
  });

  res.json(folders);
});

const postFolderCreate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { folderName } = req.body;

    if (!folderName) {
      return next(
        new CustomError(400, "Please provide a name for the folder.")
      );
    }

    const userId = (req.user as User)?.id;
    const newFolder = await prisma.folder.create({
      data: { name: folderName, userId: userId },
    });
    res.json(newFolder);
  }
);

const getFolderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const userId = (req.user as User).id;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId, userId: userId },
      include: { files: true },
    });

    if (!folder) {
      return next(
        new CustomError(404, `Folder with id ${folderId} could not be found.`)
      );
    }

    // If folder url is expired update url and expiry date to null
    if (folder.expiresAt && folder.expiresAt < new Date()) {
      await prisma.folder.update({
        where: { id: folderId },
        data: { folderUrl: null, expiresAt: null },
      });
    }

    for (const file of folder.files) {
      // Check if file signed url is expired
      const isExpired =
        !file.signedUrl || !file.expiresAt || file.expiresAt < new Date();

      if (isExpired) {
        // Generate new signed url that expires in 24 hours
        const expiresDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
        const signedUrl = getSignedCloudFrontUrl(file.name, expiresDate);

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

const patchFolderUpdate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const userId = (req.user as User)?.id;
    const { folderName } = req.body;

    if (!folderName) {
      return next(
        new CustomError(400, "Please provide a name for the folder.")
      );
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: folderId, userId: userId },
      data: { name: folderName },
    });

    res.json(updatedFolder);
  }
);

const deleteFolderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const userId = (req.user as User)?.id;
    const folder = await prisma.folder.findUnique({
      where: { id: folderId, userId: userId },
      include: { files: true },
    });

    if (!folder) {
      return next(
        new CustomError(404, `Folder with id ${folderId} could not be found.`)
      );
    }

    // Delete files from S3 Bucket
    for (const file of folder.files) {
      await deleteFileFromS3(file.name);
    }

    // Delete folder from db
    await prisma.folder.delete({ where: { id: folderId } });
    
    res.json("Successfully deleted folder");
  }
);

const putFolderUpdatePublic = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const userId = (req.user as User)?.id;
    const { expiresValue } = req.body;

    if (!expiresValue) {
      return next(new CustomError(400, "Please provide an expires date."));
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: folderId, userId: userId },
      data: {
        expiresAt: new Date(Date.now() + Number(expiresValue) * 1000),
        folderUrl: `${process.env.FRONTEND_URL}/${folderId}`,
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
