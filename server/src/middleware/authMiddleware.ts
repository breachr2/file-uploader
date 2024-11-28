import { Request, Response, NextFunction } from "express";
import { INVALID_AUTHENTICATION } from "../utils/errorConstants";
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
        INVALID_AUTHENTICATION,
        "You have not been authenticated to access this resource.",
        401
      )
    );
  }
}
