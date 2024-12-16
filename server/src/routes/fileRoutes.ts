import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../middleware/authMiddleware";
import {
  getFiles,
  postFileCreate,
  deleteFileById,
} from "../controllers/fileController";

const storage = multer.memoryStorage();
// 50 MB file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const fileRouter = Router();

fileRouter.get("/", getFiles);
fileRouter.post("/", isAuthenticated, upload.single("file"), postFileCreate);
fileRouter.delete("/:fileId", isAuthenticated, deleteFileById);

export default fileRouter;
