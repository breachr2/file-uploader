import { Request, Response } from "express";
import prisma from "../config/prisma";
import { User } from "@prisma/client";
import s3Client from "../config/s3Client";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/customError";
import { NextFunction } from "express-serve-static-core";
import { INVALID_AUTHORIZATION } from "../utils/errorConstants";

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

const getFolderById = asyncHandler(async (req: Request, res: Response) => {
  const folderId = Number(req.params.folderId);
  const userId = (req.user as User).id;

  const files = await prisma.file.findMany({
    where: { folderId: folderId, userId },
    include: { Folder: true },
  });

  for (const file of files) {
    // const getObjectParams = {
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: file.name,
    // };
    // const command = new GetObjectCommand(getObjectParams);
    // const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    file.fileUrl = `${process.env.CLOUDFRONT_URL}/${file.name}`;
  }

  res.json(files);
});

const patchFolderUpdate = asyncHandler(async (req: Request, res: Response) => {
  const folderId = Number(req.params.folderId);
  const userId = (req.user as User)?.id;
  const updatedFolder = await prisma.folder.update({
    where: { id: folderId, userId: userId },
    data: {
      name: req.body.folderName,
    },
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

export {
  getFolders,
  postFolderCreate,
  getFolderById,
  patchFolderUpdate,
  deleteFolderById,
};
