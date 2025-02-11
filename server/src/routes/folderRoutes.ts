import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import {
  getFolders,
  postFolderCreate,
  getFolderById,
  patchFolderUpdate,
  deleteFolderById,
  putFolderUpdatePublic
} from "../controllers/folderController";
const folderRouter = Router();

folderRouter.get("/", isAuthenticated, getFolders);
folderRouter.post("/", isAuthenticated, postFolderCreate);
folderRouter.get("/:folderId", isAuthenticated, getFolderById);
folderRouter.patch("/:folderId", isAuthenticated, patchFolderUpdate);
folderRouter.delete("/:folderId", isAuthenticated, deleteFolderById);
folderRouter.put("/:folderId/make-public", isAuthenticated, putFolderUpdatePublic)

export default folderRouter;