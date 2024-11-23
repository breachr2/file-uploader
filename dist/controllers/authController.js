"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
function getLogInForm(req, res) {
    res.render("log-in-form");
}
function getSignUpForm(req, res) {
    res.render("sign-up-form");
}
async function postSignUpForm(req, res, next) {
    try {
        bcryptjs_1.default.hash(req.body.password, 10, async (err, hashedPassword) => {
            await prisma_1.default.user.create({
                data: {
                    username: req.body.username,
                    password: hashedPassword,
                },
            });
        });
        res.redirect("/");
    }
    catch (err) {
        return next(err);
    }
}
function getLogOut(req, res, next) {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}
exports.default = { getLogInForm, getSignUpForm, postSignUpForm, getLogOut };
