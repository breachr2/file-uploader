import { Router } from "express";
import multer from "multer";
import { isAuth } from "../middleware/authMiddleware";
import {
  getFiles,
  getFileForm,
  postFileForm,
} from "../controllers/fileController";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileRouter = Router();

fileRouter.get("/", getFiles);
fileRouter.get("/upload-file", getFileForm);
fileRouter.post("/upload-file", isAuth, upload.single("file"), postFileForm);

export default fileRouter;
