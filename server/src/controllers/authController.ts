import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { User } from "@prisma/client";
import asyncHandler from "express-async-handler";
import passport from "passport";

async function postSignIn(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "local",
    function (err: any, user: any, info: any, status: any) {
      if (err) {
        return next(err);
      }

      if (info) {
        return res.status(401).json(info.message || "Authentication failed");
      }

      if (!user) {
        return res.status(401).json("No user");
      }

      if (user) {
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          return res.json("Successfully logged in");
        });
      }
    }
  )(req, res, next);
}

const postSignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body.formData;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    res.status(201).json(`${username} successfuly created. `);
  }
);

function getLogOut(req: Request, res: Response, next: NextFunction) {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.json("Successfully logged out");
  });
}

function getAuthStatus(req: Request, res: Response) {
  const user = req.user as User;
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: { id: user.id, username: user.username },
    });
    return;
  }
  res.json({ isAuthenticated: false });
}

export { postSignIn, postSignUp, getLogOut, getAuthStatus };
