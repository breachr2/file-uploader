import { Request, Response } from "express";
import prisma from "../config/prisma";
import { User } from "@prisma/client";
import s3Client from "../config/s3Client";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function getFolders(req: Request, res: Response) {
  const userId = (req.user as User)?.id || null;
  const folders = await prisma.folder.findMany({ where: { userId: userId } });
  if (folders.length !== 0) {
    return res.render("folders", { folders: folders });
  }
  res.render("folders");
}

function getFolderCreateForm(req: Request, res: Response) {
  res.render("create-folder-form");
}

async function postFolderCreateForm(req: Request, res: Response) {
  const { folder_name } = req.body;
  const userId = (req.user as User)?.id;

  try {
    await prisma.folder.create({ data: { name: folder_name, userId: userId } });
  } catch (err) {
    console.log(err);
  }

  res.redirect("/folders");
}

async function getFolderById(req: Request, res: Response) {
  const folderId = Number(req.params.folderId);

  const files = await prisma.file.findMany({
    where: { folderId: folderId },
    include: { Folder: true },
  });

  for (const file of files) {
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name,
    };
  
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    file.imageUrl = url
  }

  res.render("files", { files });
}

async function getFolderUpdateForm(req: Request, res: Response) {
  const folderId = Number(req.params.folderId);
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });

  res.render("update-folder-form", { folder });
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
    await s3Client.send(command)
  }

  await prisma.$transaction([
    prisma.file.deleteMany({ where: { folderId } }),
    prisma.folder.delete({ where: { id: folderId } }),
  ]);

  res.redirect("/folders");
}

export {
  getFolders,
  getFolderCreateForm,
  postFolderCreateForm,
  getFolderById,
  getFolderUpdateForm,
  postFolderUpdateForm,
  deleteFolderById,
};
