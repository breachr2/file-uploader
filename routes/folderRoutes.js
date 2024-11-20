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

folderRouter.get("/create-folder", (req, res) => {
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

folderRouter.post("/:folderId", isAuth, async (req, res) => {
  const folderId = Number(req.params.folderId);
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });

  // Check if the folder belongs to the current user
  if (folder.userId === req.user.id) {
    await prisma.folder.delete({ where: { id: folderId } });
    return res.redirect("/folders");
  }
  res.status(401).send("You do not have permissions to delete this folder.");
});
module.exports = folderRouter;
