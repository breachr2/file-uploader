import { Request, Response, NextFunction } from "express";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You are not authenticated.");
  }
}
