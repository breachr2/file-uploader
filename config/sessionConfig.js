const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const sessionConfig = expressSession({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

module.exports = sessionConfig;
