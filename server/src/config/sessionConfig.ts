import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const sessionConfig = expressSession({
  cookie: {
    secure: process.env.NODE_ENV === "PROD",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "PROD" ? "none" : "lax",
  },
  secret: process.env.SECRET || "",
  saveUninitialized: false,
  resave: false,
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export default sessionConfig;
