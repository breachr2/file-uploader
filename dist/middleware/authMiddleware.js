"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = isAuth;
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).send("You are not authenticated.");
    }
}
