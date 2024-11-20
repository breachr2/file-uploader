module.exports = function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You are not authenticated.");
  }
};
