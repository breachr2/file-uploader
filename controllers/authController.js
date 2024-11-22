const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma")

function getLogInForm(req, res) {
  res.render("log-in-form");
}

function getSignUpForm(req, res) {
  res.render("sign-up-form");
}

async function postSignUpForm(req, res) {
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
}

function getLogOut(req, res) {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = {
  getLogInForm,
  getSignUpForm,
  postSignUpForm,
  getLogOut,
};
