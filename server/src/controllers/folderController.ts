import { Request, Response } from "express";
import prisma from "../config/prisma";
import { User } from "@prisma/client";
import s3Client from "../config/s3Client";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function getFolders(req: Request, res: Response) {
  const userId = (req.user as User)?.id || null;
  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
      include: { files: true },
    });
    res.json(folders);
  } catch (err) {
    res.status(401).json("Failed to fetch folders");
  }
}

async function postFolderCreateForm(req: Request, res: Response) {
  const { folderName } = req.body;
  const userId = (req.user as User)?.id;

  try {
    const newFolder = await prisma.folder.create({
      data: { name: folderName, userId: userId },
    });
    res.status(201).json(newFolder);
  } catch (err) {
    res.json("A server error has occured.");
  }
}

async function getFolderById(req: Request, res: Response) {
  const folderId = Number(req.params.folderId);
  const userId = (req.user as User).id;

  const files = await prisma.file.findMany({
    where: { folderId: folderId, userId },
    include: { Folder: true },
  });

  // Retrieve each file from S3
  for (const file of files) {
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    file.imageUrl = url;
  }

  res.json(files);
}

async function postFolderUpdateForm(req: Request, res: Response) {
  const folderId = Number(req.params.folderId);
  const userId = (req.user as User)?.id;
  await prisma.folder.update({
    where: { id: folderId, userId: userId },
    data: {
      name: req.body.name,
    },
  });
  res.redirect("/folders");
}

async function deleteFolderById(req: Request, res: Response) {
  const folderId = Number(req.params.folderId);
  const userId = (req.user as User)?.id;
  const folder = await prisma.folder.findUnique({
    where: { id: folderId, userId: userId },
  });

  if (!folder) {
    res
      .status(404)
      .send("Folder not found or you do not have permissions to delete it.");
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

  res.redirect("/folders");
}

export {
  getFolders,
  postFolderCreateForm,
  getFolderById,
  postFolderUpdateForm,
  deleteFolderById,
};
