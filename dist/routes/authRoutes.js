"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController_1 = __importDefault(require("../controllers/authController"));
const authRouter = (0, express_1.Router)();
authRouter.get("/log-in", authController_1.default.getLogInForm);
authRouter.post("/log-in", passport_1.default.authenticate("local", { successRedirect: "/", failureRedirect: "/" }));
authRouter.get("/sign-up", authController_1.default.getSignUpForm);
authRouter.post("/sign-up", authController_1.default.postSignUpForm);
authRouter.get("/log-out", authController_1.default.getLogOut);
exports.default = authRouter;
