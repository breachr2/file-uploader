import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../config/prisma";
import { NextFunction } from "express-serve-static-core";
import CustomError from "../utils/customError";

const getPublicFolder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (!folder?.expiresAt || !folder.folderUrl) {
      return next(
        new CustomError(300, "This folder is not publicably viewable", 404)
      );
    }

    if (folder.expiresAt < new Date(Date.now())) {
    
      // If folder url is expired, set the url and expiry date to null
      await prisma.folder.update({
        where: { id: folderId },
        data: { folderUrl: null, expiresAt: null },
      });

      return next(
        new CustomError(300, "This folder's url is no longer valid.", 410)
      );
    }

    res.json([folder]);
  }
);

export { getPublicFolder };
