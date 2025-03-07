import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import CustomError from "../utils/customError";
import asyncHandler from "express-async-handler";
import { FileQueryParams, getOrderBy, isExpired } from "../utils/utils";

const getPublicFolder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const folderSlug = req.params.folderSlug;
    const { name, size, createdAt } = req.query as FileQueryParams;

    const orderBy = getOrderBy({ name, size, createdAt });

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

    if (isExpired(folder.expiresAt)) {
      // If folder url is expired, set the url and expires date to null
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
