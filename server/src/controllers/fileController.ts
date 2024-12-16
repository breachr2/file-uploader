import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma";
import s3Client from "../config/s3Client";
import cloudFrontClient from "../config/cloudFrontClient";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/customError";

const generateRandomName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const getFiles = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as User)?.id;
  const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY || ""
  const keyPairId = process.env.KEY_PAIR_ID || ""

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
  });

  for (const file of files) {
    file.fileUrl = getSignedUrl({
      url: `${process.env.CLOUDFRONT_URL}/${file.name}`,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      privateKey: privateKey,
      keyPairId: keyPairId
    })
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

  // Invalidating cloud front cache for deleted file
  const invalidationParams = {
    DistributionId: process.env.DISTRIBUTION_ID,
    InvalidationBatch: {
      Paths: {
        Quantity: 1,
        Items: ["/" + file.name],
      },
      CallerReference: file.name,
    },
  };

  const invalidationCommand = new CreateInvalidationCommand(invalidationParams);
  await cloudFrontClient.send(invalidationCommand);

  const deletedFile = await prisma.file.delete({
    where: { id: fileId, userId: userId },
  });
  res.json(deletedFile);
});

export { getFiles, postFileCreate, deleteFileById };
