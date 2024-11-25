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
  const { username, password } = req.body.formData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    res.status(201).json(`${username} successfuly created. `);
  } catch (err: any) {
    // Prisma error code for unique constraint failed on username
    if ((err.code = "P2002")) {
      res.status(400).json({
        error: "Username already exists. Please choose a different username",
      });
    } else {
      res.status(500).json({
        error: "An error occured during sign-up. Please try again later.",
      });
    }
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

export { getLogInForm, getSignUpForm, postSignUpForm, getLogOut };
