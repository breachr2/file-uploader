import { Router } from "express";
import passport from "passport";
import {
  getLogInForm,
  getSignUpForm,
  postSignUpForm,
  getLogOut,
} from "../controllers/authController";

const authRouter = Router();

authRouter.get("/log-in", getLogInForm);
authRouter.post(
  "/log-in",
  passport.authenticate("local", { successRedirect: "/", failureRedirect: "/" })
);
authRouter.get("/sign-up", getSignUpForm);
authRouter.post("/sign-up", postSignUpForm);
authRouter.get("/log-out", getLogOut);

export default authRouter;
