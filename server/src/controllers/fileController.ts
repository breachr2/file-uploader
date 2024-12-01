import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma";
import s3Client from "../config/s3Client";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { User } from "@prisma/client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/customError";

const generateRandomName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const getFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id;

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
  });
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

  const newFile = await prisma.file.create({ data: fileData });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: randomImageName,
    Body: buffer,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  res.json(newFile);
});

async function getFileDownload(req: Request, res: Response) {
  const userId = (req.user as User)?.id;
  const fileId = Number(req.params.fileId);
  const file = await prisma.file.findUnique({
    where: { id: fileId, userId: userId },
  });

  if (!file) {
    res
      .status(404)
      .send(
        "File not found, or you do not have permissions to download this file"
      );
    return;
  }

  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  res.render("files", { file, imageUrl: url });
}

const deleteFileById = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id;
  const fileId = Number(req.params.fileId);
  const file = await prisma.file.findUnique({
    where: { id: fileId, userId: userId },
  });

  if (!file) {
    throw new CustomError(305, "File not found", 404);
  }

  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3Client.send(command);

  const deletedFile = await prisma.file.delete({
    where: { id: fileId, userId: userId },
  });
  res.json(deletedFile);
});

export { getFiles, postFileCreate, getFileDownload, deleteFileById };
