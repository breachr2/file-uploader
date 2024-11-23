"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const prisma_1 = __importDefault(require("../config/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const s3Client_1 = __importDefault(require("../config/s3Client"));
const client_s3_1 = require("@aws-sdk/client-s3");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const fileRouter = (0, express_1.Router)();
const generateRandomName = (bytes = 32) => {
    return crypto_1.default.randomBytes(bytes).toString("hex");
};
fileRouter.get("/", async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.render("files");
    }
    const files = await prisma_1.default.file.findMany({
        where: { userId: userId, folderId: null },
    });
    res.render("files", { files });
});
fileRouter.get("/upload-file", async (req, res) => {
    const userId = req.user?.id || null;
    const folders = await prisma_1.default.folder.findMany({ where: { userId: userId } });
    res.render("upload-file-form", { folders });
});
fileRouter.post("/upload-file", authMiddleware_1.isAuth, upload.single("file"), async (req, res) => {
    const userId = req.user.id;
    const { size, mimetype, buffer } = req.file;
    const randomImageName = generateRandomName();
    // If user selects a folder when creating file
    if (req.body.folderId !== "") {
        await prisma_1.default.file.create({
            data: {
                name: randomImageName,
                size: size,
                userId: userId,
                folderId: Number(req.body.folderId),
            },
        });
    }
    else {
        await prisma_1.default.file.create({
            data: {
                name: randomImageName,
                size: size,
                userId: userId,
            },
        });
    }
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: randomImageName,
        Body: buffer,
        ContentType: mimetype,
    };
    const command = new client_s3_1.PutObjectCommand(params);
    const response = await s3Client_1.default.send(command);
    res.redirect("/");
});
exports.default = fileRouter;
