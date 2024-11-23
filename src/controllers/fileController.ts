import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../config/prisma";
import s3Client from "../config/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const generateRandomName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

async function getFiles(req: Request, res: Response) {
  const userId = req.user.id;

  if (!userId) {
    return res.render("files");
  }

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
  });
  res.render("files", { files });
}

async function getFileForm(req: Request, res: Response) {
  const userId = req.user?.id || null;
  const folders = await prisma.folder.findMany({ where: { userId: userId } });
  res.render("upload-file-form", { folders });
}

async function postFileForm(req: Request, res: Response) {
  const userId = req.user.id;
  const { size, mimetype, buffer } = req.file;
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
  const response = await s3Client.send(command);
  res.redirect("/");
}

export { getFiles, getFileForm, postFileForm };
