import { NextFunction, Request, Response } from "express";
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
import {
  getOrderBy,
  FileQueryParams,
  generateExpiresDate,
  generateRandomName,
} from "../utils/utils";

const getFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id;
  const { name, size, createdAt } = req.query as FileQueryParams;

  const orderBy = getOrderBy({ name, size, createdAt });

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
    orderBy: orderBy,
  });

  for (const file of files) {
    const isExpired =
      !file.signedUrl || !file.expiresAt || file.expiresAt < new Date();

    if (isExpired) {
      // Url expires in 24 hours
      const expiresDate = generateExpiresDate(1000 * 60 * 60 * 24);
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

const postFileCreate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as User)?.id;

    if (!req.file) {
      return next(new CustomError(400, "Please provide a file."));
    }

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

    const newFile = await prisma.file.create({ data: fileData });

    await updateFileFromS3(randomImageName, mimetype, buffer);

    res.json(newFile);
  }
);

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

    deleteFileFromS3(file.name);

    invalidateCloudFrontCache(file.name);

    const deletedFile = await prisma.file.delete({
      where: { id: fileId, userId: userId },
    });

    res.json(deletedFile);
  }
);

export { getFiles, postFileCreate, deleteFileById };
