"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const folderRouter = (0, express_1.Router)();
folderRouter.get("/", async (req, res) => {
    const userId = req.user?.id || null;
    const folders = await prisma_1.default.folder.findMany({ where: { userId: userId } });
    if (folders.length !== 0) {
        return res.render("folders", { folders: folders });
    }
    res.render("folders");
});
folderRouter.get("/create-folder", authMiddleware_1.isAuth, (req, res) => {
    res.render("create-folder-form");
});
folderRouter.post("/create-folder", authMiddleware_1.isAuth, async (req, res) => {
    const { folder_name } = req.body;
    const userId = Number(req.user.id);
    try {
        await prisma_1.default.folder.create({ data: { name: folder_name, userId: userId } });
    }
    catch (err) {
        console.log(err);
    }
    res.redirect("/folders");
});
folderRouter.get("/:folderId", authMiddleware_1.isAuth, async (req, res) => {
    const folderId = Number(req.params.folderId);
    const files = await prisma_1.default.file.findMany({
        where: { folderId: folderId },
        include: { Folder: true },
    });
    res.render("files", { files });
});
folderRouter.get("/:folderId/update-folder", authMiddleware_1.isAuth, async (req, res) => {
    const folderId = Number(req.params.folderId);
    const folder = await prisma_1.default.folder.findUnique({ where: { id: folderId } });
    res.render("update-folder-form", { folder });
});
folderRouter.post("/:folderId", authMiddleware_1.isAuth, async (req, res) => {
    const folderId = Number(req.params.folderId);
    await prisma_1.default.folder.update({
        where: { id: folderId, userId: req.user.id },
        data: {
            name: req.body.name,
        },
    });
    res.redirect("/folders");
});
folderRouter.post("/:folderId/delete", authMiddleware_1.isAuth, async (req, res) => {
    const folderId = Number(req.params.folderId);
    const folder = await prisma_1.default.folder.findUnique({
        where: { id: folderId, userId: req.user.id },
    });
    if (!folder) {
        return res
            .status(404)
            .send("Folder not found or you do not have permissions to delete it.");
    }
    await prisma_1.default.$transaction([
        prisma_1.default.file.deleteMany({ where: { folderId } }),
        prisma_1.default.folder.delete({ where: { id: folderId } }),
    ]);
    res.redirect("/folders");
});
exports.default = folderRouter;
