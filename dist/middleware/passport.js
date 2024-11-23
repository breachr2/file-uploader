"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = require("passport-local");
const prisma_1 = __importDefault(require("../config/prisma"));
passport_1.default.use(new passport_local_1.Strategy(async (username, password, done) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { username: username },
        });
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: id } });
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
