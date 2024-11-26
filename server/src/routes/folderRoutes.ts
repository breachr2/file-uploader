import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import {
  getFolders,
  postFolderCreateForm,
  getFolderById,
  postFolderUpdateForm,
  deleteFolderById,
} from "../controllers/folderController";
const folderRouter = Router();

folderRouter.get("/", getFolders);
folderRouter.post("/", postFolderCreateForm);
folderRouter.get("/:folderId", isAuth, getFolderById);
folderRouter.post("/:folderId", isAuth, postFolderUpdateForm);
folderRouter.post("/:folderId/delete", isAuth, deleteFolderById);

export default folderRouter;
