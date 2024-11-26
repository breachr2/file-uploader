import { Router } from "express";
import passport from "passport";
import {
  getLogInForm,
  getSignUpForm,
  postSignUpForm,
  getLogOut,
  getAuthStatus,
} from "../controllers/authController";

const authRouter = Router();

authRouter.get("/log-in", getLogInForm);
authRouter.post("/log-in", passport.authenticate("local"), (req, res) => {
  res.json("Successfuly logged in")
});
authRouter.get("/sign-up", getSignUpForm);
authRouter.post("/sign-up", postSignUpForm);
authRouter.get("/log-out", getLogOut);
authRouter.get("/auth/status", getAuthStatus);

export default authRouter;
