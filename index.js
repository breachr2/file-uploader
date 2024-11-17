require("dotenv").config();
const express = require("express");
const path = require("node:path");
const passport = require("passport");
const sessionConfig = require("./config/sessionConfig");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("./middleware/passport");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(sessionConfig);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/log-in", (req, res) => {
  res.render("log-in-form");
});

app.post(
  "/log-in",
  passport.authenticate("local", { successRedirect: "/", failureRedirect: "/" })
);

app.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

app.post("/sign-up", async (req, res) => {
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
app.get("/", async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { sid: req.session.id },
  });
  
  res.render("index", { user: req.user, sessionId : session.sid });
});

app.listen(PORT);
