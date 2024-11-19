
module.exports = function isAuth(req, res, next) {
  if (req.user) {
    return next()
  }
  res.status(401).send("You are not authenticated.")
}