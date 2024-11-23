"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const client_1 = require("@prisma/client");
require("dotenv/config");
const secret = process.env.SECRET || "";
const sessionConfig = (0, express_session_1.default)({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: secret,
    saveUninitialized: false,
    resave: false,
    store: new prisma_session_store_1.PrismaSessionStore(new client_1.PrismaClient(), {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
});
exports.default = sessionConfig;
