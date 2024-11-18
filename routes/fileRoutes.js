const { Router } = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fileRouter = Router();

fileRouter.get("/upload-file", (req, res) => {
  res.render("upload-file-form");
});

fileRouter.post("/upload-file", upload.single("file"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.redirect("/");
});

module.exports = fileRouter;

// req.file object
// {
//   fieldname: 'file',
//   originalname: '1afabf5f4c031530da0902b6fadad6a3.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: 'uploads/',
//   filename: '679ea057ca94b4c65ccb0f34a407216b',
//   path: 'uploads/679ea057ca94b4c65ccb0f34a407216b',
//   size: 309090
// }