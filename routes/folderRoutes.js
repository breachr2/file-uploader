const { Router } = require("express");
const prisma = require("../config/prisma")
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
module.exports = folderRouter;
