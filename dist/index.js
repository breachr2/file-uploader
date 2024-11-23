"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const passport_1 = __importDefault(require("passport"));
const sessionConfig_1 = __importDefault(require("./config/sessionConfig"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const folderRoutes_1 = __importDefault(require("./routes/folderRoutes"));
const prisma_1 = __importDefault(require("./config/prisma"));
require("./middleware/passport");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.set("views", node_path_1.default.join(__dirname, "views"));
app.use("/uploads", express_1.default.static("uploads"));
app.use(sessionConfig_1.default);
app.use(passport_1.default.session());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(authRoutes_1.default);
app.use("/folders", folderRoutes_1.default);
app.use("/files", fileRoutes_1.default);
app.get("/", async (req, res) => {
    let session = null;
    if (req.isAuthenticated()) {
        session = await prisma_1.default.session.findUnique({
            where: { sid: req.session.id },
        });
    }
    res.render("index", { user: req.user, sessionId: session?.sid });
});
app.listen(PORT);
