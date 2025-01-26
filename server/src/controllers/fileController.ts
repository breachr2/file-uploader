import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/customError";
import { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import {
  getSignedCloudFrontUrl,
  invalidateCloudFrontCache,
} from "../services/cloudFrontService";
import { updateFileFromS3, deleteFileFromS3 } from "../services/s3Service";

export const generateRandomName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const getFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id;

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
  });

  for (const file of files) {
    const isExpired =
      !file.signedUrl || !file.expiresAt || file.expiresAt < new Date();

    if (isExpired) {
      // Url expires in 24 hours
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

  res.json(files);
});

const postFileCreate = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id;
  const { originalname, size, mimetype, buffer } =
    req.file as Express.Multer.File;
  const randomImageName = generateRandomName();

  const fileData: Prisma.FileCreateInput = {
    originalName: originalname,
    name: randomImageName,
    size: size,
    User: { connect: { id: userId } },
    mimetype: mimetype,
  };

  if (req.body.folderId) {
    fileData.Folder = { connect: { id: Number(req.body.folderId) } };
  }

  // Save the file to db
  const newFile = await prisma.file.create({ data: fileData });

  // Save the file to an S3 bucket
  await updateFileFromS3(randomImageName, mimetype, buffer);

  res.json(newFile);
});

const deleteFileById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User)?.id;
    const fileId = Number(req.params.fileId);
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return next(
        new CustomError(404, `File with id ${fileId} could not been found.`)
      );
    }

    if (file.userId !== userId) {
      return next(
        new CustomError(403, "You are not authorized to delete this file.")
      );
    }

    try {
      // Delete file from S3
      deleteFileFromS3(file.name);

      // Invalidating cloudfront cache
      invalidateCloudFrontCache(file.name);

      // Delete file from db
      const deletedFile = await prisma.file.delete({
        where: { id: fileId, userId: userId },
      });

      res.json(deletedFile);
    } catch (err) {
      next(new CustomError(500, "An error occurred while deleting the file."));
    }
  }
);

export { getFiles, postFileCreate, deleteFileById };
