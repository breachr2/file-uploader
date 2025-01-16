import { Router } from "express";
import { getPublicFolder } from "../controllers/publicFolderController";

const router = Router()

router.get("/:folderSlug", getPublicFolder)

export default router