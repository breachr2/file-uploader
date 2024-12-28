import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import {
  getFolders,
  postFolderCreate,
  getFolderById,
  patchFolderUpdate,
  deleteFolderById,
  getPublicFolder,
} from "../controllers/folderController";
const folderRouter = Router();

folderRouter.get("/", isAuthenticated, getFolders);
folderRouter.post("/", isAuthenticated, postFolderCreate);
folderRouter.get("/:folderId", isAuthenticated, getFolderById);
folderRouter.patch("/:folderId", isAuthenticated, patchFolderUpdate);
folderRouter.delete("/:folderId", isAuthenticated, deleteFolderById);
folderRouter.get("/public/:folderId", getPublicFolder)

export default folderRouter;

// curl localhost:5000/folders/2
// curl -X POST localhost:5000/folders -d "folderName=TestFolder"
