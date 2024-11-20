const { Router } = require("express");
const multer = require("multer");
const prisma = require("../config/prisma");
const isAuth = require("../middleware/authMiddleware");
const upload = multer({ dest: "uploads/" });

const fileRouter = Router();

fileRouter.get("/", async (req, res) => {
  const userId = req.user?.id;
  try {
    const files = await prisma.file.findMany({ where: { userId: userId } });
    res.render("files", { files });
  } catch (err) {
    console.log(err);
  }
});

fileRouter.get("/upload-file", async (req, res) => {
  const userId = req.user?.id || null;
  const folders = await prisma.folder.findMany({ where: { userId: userId } });
  res.render("upload-file-form", { folders });
});

fileRouter.post(
  "/upload-file",
  isAuth,
  upload.single("file"),
  async (req, res) => {
    const userId = req.user.id;
    const { filename, size } = req.file;
    const folderId = Number(req.body.folderId);

    try {
      await prisma.file.create({
        data: {
          name: filename,
          size: size,
          userId: userId,
          folderId: folderId,
        },
      });
    } catch (err) {
      console.log(err);
    }
    res.redirect("/");
  }
);

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
