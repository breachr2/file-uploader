import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const secret = process.env.SECRET || "";

const sessionConfig = expressSession({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  secret: secret,
  saveUninitialized: false,
  resave: false,
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export default sessionConfig
