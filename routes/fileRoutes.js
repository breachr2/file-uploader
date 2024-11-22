const { Router } = require("express");
const multer = require("multer");
const prisma = require("../config/prisma");
const isAuth = require("../middleware/authMiddleware");
const s3Client = require("../config/s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileRouter = Router();

fileRouter.get("/", async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.render("files");
  }

  const files = await prisma.file.findMany({
    where: { userId: userId, folderId: null },
  });
  res.render("files", { files });
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
    const { originalname, size, mimetype, buffer } = req.file;

    // If user selects a folder when creating file
    if (req.body.folderId !== "") {
      await prisma.file.create({
        data: {
          name: originalname,
          size: size,
          userId: userId,
          folderId: Number(req.body.folderId),
        },
      });
    } else {
      await prisma.file.create({
        data: {
          name: originalname,
          size: size,
          userId: userId,
        },
      });
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: originalname,
      Body: buffer,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log(response);
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
