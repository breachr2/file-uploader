import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(
      new CustomError(
        401,
        "You have not been authenticated to access this resource."
      )
    );
  }
}
