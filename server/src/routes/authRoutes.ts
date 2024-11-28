import { Router } from "express";
import {
  postSignUp,
  getLogOut,
  getAuthStatus,
  postSignIn,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/log-in", postSignIn);
authRouter.get("/auth/status", getAuthStatus);
authRouter.post("/sign-up", postSignUp);
authRouter.get("/log-out", getLogOut);

export default authRouter;
