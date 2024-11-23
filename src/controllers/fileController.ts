import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma";
import s3Client from "../config/s3Client";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { User } from "@prisma/client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const generateRandomName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

async function getFiles(req: Request, res: Response) {
  const userId = (req.user as User)?.id;

  if (!userId) {
    return res.render("files");
  }

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
  });
  res.render("files", { files });
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

  // If user selects a folder when creating file
  if (req.body.folderId !== "") {
    await prisma.file.create({
      data: {
        name: randomImageName,
        size: size,
        userId: userId,
        folderId: Number(req.body.folderId),
      },
    });
  } else {
    await prisma.file.create({
      data: {
        name: randomImageName,
        size: size,
        userId: userId,
      },
    });
  }
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: randomImageName,
    Body: buffer,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  res.redirect("/");
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
