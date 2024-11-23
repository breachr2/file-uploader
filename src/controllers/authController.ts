import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

function getLogInForm(req: Request, res: Response) {
  res.render("log-in-form");
}

function getSignUpForm(req: Request, res: Response) {
  res.render("sign-up-form");
}

async function postSignUpForm(req: Request, res: Response, next: NextFunction) {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
        },
      });
    });
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
}

function getLogOut(req: Request, res: Response, next: NextFunction) {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

export default { getLogInForm, getSignUpForm, postSignUpForm, getLogOut };
