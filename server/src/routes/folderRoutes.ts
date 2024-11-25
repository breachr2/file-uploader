import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import {
  getFolders,
  getFolderCreateForm,
  postFolderCreateForm,
  getFolderById,
  getFolderUpdateForm,
  postFolderUpdateForm,
  deleteFolderById,
} from "../controllers/folderController";
const folderRouter = Router();

folderRouter.get("/", getFolders);
folderRouter.get("/create-folder", isAuth, getFolderCreateForm);
// folderRouter.post("/create-folder", isAuth, postFolderCreateForm);
folderRouter.post("/", postFolderCreateForm);
folderRouter.get("/:folderId", isAuth, getFolderById);
folderRouter.get("/:folderId/update-folder", isAuth, getFolderUpdateForm);
folderRouter.post("/:folderId", isAuth, postFolderUpdateForm);
folderRouter.post("/:folderId/delete", isAuth, deleteFolderById);

export default folderRouter;
