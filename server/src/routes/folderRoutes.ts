import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import {
  getFolders,
  postFolderCreate,
  getFolderById,
  postFolderUpdate,
  deleteFolderById,
} from "../controllers/folderController";
const folderRouter = Router();

folderRouter.get("/", getFolders);
folderRouter.post("/", isAuth, postFolderCreate);
folderRouter.get("/:folderId", isAuth, getFolderById);
folderRouter.post("/:folderId", isAuth, postFolderUpdate);
folderRouter.delete("/:folderId", isAuth, deleteFolderById);

export default folderRouter;
