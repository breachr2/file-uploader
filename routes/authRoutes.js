const { Router } = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const prisma = require("../config/prisma")

const authRouter = Router();

authRouter.get("/log-in", (req, res) => {
  res.render("log-in-form");
});

authRouter.post(
  "/log-in",
  passport.authenticate("local", { successRedirect: "/", failureRedirect: "/" })
);

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

authRouter.post("/sign-up", async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
        },
      });
    });
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

authRouter.get("/log-out", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = authRouter;
