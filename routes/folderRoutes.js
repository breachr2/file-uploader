const { Router } = require("express");
const prisma = require("../config/prisma");
const isAuth = require("../middleware/authMiddleware");

const folderRouter = Router();

folderRouter.get("/", async (req, res) => {
  const userId = req.user?.id || null;
  const folders = await prisma.folder.findMany({ where: { userId: userId } });
  if (folders.length !== 0) {
    return res.render("folders", { folders: folders });
  }
  res.render("folders");
});

folderRouter.get("/create-folder", isAuth, (req, res) => {
  res.render("create-folder-form");
});

folderRouter.post("/create-folder", isAuth, async (req, res) => {
  const { folder_name } = req.body;
  const userId = Number(req.user.id);

  try {
    await prisma.folder.create({ data: { name: folder_name, userId: userId } });
  } catch (err) {
    console.log(err);
  }

  res.redirect("/folders");
});

folderRouter.get("/:folderId", isAuth, async (req, res) => {
  const folderId = Number(req.params.folderId);

  const files = await prisma.file.findMany({
    where: { folderId: folderId },
    include: { Folder: true },
  });

  res.render("files", { files });
});

folderRouter.get("/:folderId/update-folder", isAuth, async (req, res) => {
  const folderId = Number(req.params.folderId);
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });

  res.render("update-folder-form", { folder });
});

folderRouter.post("/:folderId", isAuth, async (req, res) => {
  const folderId = Number(req.params.folderId);
  await prisma.folder.update({
    where: { id: folderId, userId: req.user.id },
    data: {
      name: req.body.name,
    },
  });
  res.redirect("/folders");
});

folderRouter.post("/:folderId/delete", isAuth, async (req, res) => {
  const folderId = Number(req.params.folderId);
  const folder = await prisma.folder.findUnique({
    where: { id: folderId, userId: req.user.id },
  });

  if (!folder) {
    return res
      .status(404)
      .send("Folder not found or you do not have permissions to delete it.");
  }
  await prisma.$transaction([
    prisma.file.deleteMany({ where: { folderId } }),
    prisma.folder.delete({ where: { id: folderId } }),
  ]);

  res.redirect("/folders");
});

module.exports = folderRouter;
