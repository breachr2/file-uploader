import express, { NextFunction, Request, Response } from "express";
import path from "node:path";
import passport from "passport";
import sessionConfig from "./config/sessionConfig";
import authRouter from "./routes/authRoutes";
import fileRouter from "./routes/fileRoutes";
import folderRouter from "./routes/folderRoutes";
import prisma from "./config/prisma";
import cors from "cors";
import "./middleware/passport";
import { MulterError } from "multer";
import CustomError from "./utils/customError";

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "../src/views"));

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(sessionConfig);
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

app.get("/", async (req: Request, res: Response) => {
  let session = null;

  if (req.isAuthenticated()) {
    session = await prisma.session.findUnique({
      where: { sid: req.session.id },
    });
  }

  res.render("index", { user: req.user, sessionId: session?.sid });
});

// Catch all error route
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File size exceeds the 50 MB limit" });
      return;
    }
  }

  if (error instanceof CustomError) {
    res
      .status(error.statusCode)
      .json({ errorCode: error.errorCode, error: error.message });
    return;
  }

  res.status(500).json({ error: "A server error has occured" });
});

app.listen(PORT);
