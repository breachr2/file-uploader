import { Router } from "express";
import multer from "multer";
import { isAuth } from "../middleware/authMiddleware";
import {
  getFiles,
  getFileForm,
  postFileForm,
  getFileDownload,
} from "../controllers/fileController";

const storage = multer.memoryStorage();
// 50 MB file size limit
const upload = multer({ storage: storage, limits: { fileSize : 50 * 1024 * 1024} }); 

const fileRouter = Router();

fileRouter.get("/", getFiles);
fileRouter.get("/upload-file", getFileForm);
fileRouter.post("/", isAuth, upload.single("file"), postFileForm);
fileRouter.get("/:fileId/download", isAuth, getFileDownload);

export default fileRouter;
