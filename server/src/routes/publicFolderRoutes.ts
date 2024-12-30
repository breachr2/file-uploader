import { Router } from "express";
import { getPublicFolder } from "../controllers/publicFolderController";

const router = Router()

router.get("/:folderId", getPublicFolder)

export default router