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
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });

  res.render("update-folder-form", { folder });
});

folderRouter.post("/:folderId", isAuth, async (req, res) => {
  const folderId = Number(req.params.folderId);
  await prisma.folder.update({
    where: { id: folderId },
    data: {
      name: req.body.name,
    },
  });
  res.redirect("/folders");
});

folderRouter.post("/:folderId/delete", isAuth, async (req, res) => {
  const folderId = Number(req.params.folderId);
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });

  if (!folder) {
    return res.status(401).send("Folder not Found");
  }

  if (folder.userId !== req.user.id) {
    res.status(401).send("You do not have permissions to delete this folder.");
  }

  await prisma.folder.delete({ where: { id: folderId } });
  return res.redirect("/folders");
});

module.exports = folderRouter;
