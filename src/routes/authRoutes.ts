import { Router } from "express";
import passport from "passport";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.get("/log-in", authController.getLogInForm);
authRouter.post(
  "/log-in",
  passport.authenticate("local", { successRedirect: "/", failureRedirect: "/" })
);
authRouter.get("/sign-up", authController.getSignUpForm);
authRouter.post("/sign-up", authController.postSignUpForm);
authRouter.get("/log-out", authController.getLogOut);

export default authRouter
