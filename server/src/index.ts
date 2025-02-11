import express, { NextFunction, Request, Response } from "express";
import path from "node:path";
import passport from "passport";
import sessionConfig from "./config/sessionConfig";
import authRouter from "./routes/authRoutes";
import fileRouter from "./routes/fileRoutes";
import folderRouter from "./routes/folderRoutes";
import publicFolderRouter from "./routes/publicFolderRoutes";
import cors from "cors";
import { MulterError } from "multer";
import CustomError from "./utils/customError";
import helmet from "helmet";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import "./middleware/passport";

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../src/views"));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(sessionConfig);
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter);
app.use("/public-folders", publicFolderRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

// Catch all error route
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File size exceeds the 50 MB limit" });
      return;
    }
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(400).json({
        errorCode: "P2002",
        error: "Username already exists. Please choose a different username.",
      });
      return;
    }
    res.status(400).json({ errorCode: error.code, error: error.message });
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: "A server error has occured" });
});

app.listen(PORT);
