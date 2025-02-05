import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import CustomError from "../utils/customError";
import asyncHandler from "express-async-handler";

const getPublicFolder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderSlug = req.params.folderSlug;
    const { name, size, createdAt } = req.query;

    const orderBy: any = {};
    if (createdAt === "asc" || createdAt === "desc") {
      orderBy.createdAt = createdAt;
    } else if (name === "asc" || name === "desc") {
      orderBy.name = name;
    } else if (size === "asc" || size === "desc") {
      orderBy.size = size;
    }

    const folder = await prisma.folder.findUnique({
      where: { slug: folderSlug },
      include: { files: { orderBy: orderBy } },
    });

    if (!folder) {
      return next(
        new CustomError(404, `Folder with id ${folderSlug} could not be found.`)
      );
    }

    if (!folder?.expiresAt || !folder.folderUrl) {
      return next(
        new CustomError(400, "This folder is not publicably viewable")
      );
    }

    if (folder.expiresAt < new Date(Date.now())) {
      // If folder url is expired, set the url and expiry date to null
      await prisma.folder.update({
        where: { slug: folderSlug },
        data: { folderUrl: null, expiresAt: null },
      });

      return next(
        new CustomError(410, "This folder's url is no longer valid.")
      );
    }

    res.json([folder]);
  }
);

export { getPublicFolder };
