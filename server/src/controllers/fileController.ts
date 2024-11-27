import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma";
import s3Client from "../config/s3Client";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { User } from "@prisma/client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";

const generateRandomName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

async function getFiles(req: Request, res: Response) {
  const userId = (req.user as User)?.id;

  if (!userId) {
    res.json("Wrong user");
    return;
  }

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
  });
  res.json(files);
}

async function getFileForm(req: Request, res: Response) {
  const userId = (req.user as User)?.id || null;
  const folders = await prisma.folder.findMany({ where: { userId: userId } });
  res.render("upload-file-form", { folders });
}

async function postFileForm(req: Request, res: Response) {
  const userId = (req.user as User)?.id;
  const { size, mimetype, buffer } = req.file as Express.Multer.File;
  const randomImageName = generateRandomName();

  const fileData: Prisma.FileCreateInput = {
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
}

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

export { getFiles, getFileForm, postFileForm, getFileDownload };
