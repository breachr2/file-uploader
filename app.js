require("dotenv").config();
const express = require("express");
const path = require("node:path");
const passport = require("passport");
const sessionConfig = require("./config/sessionConfig");
const authRouter = require("./routes/authRoutes");
const fileRouter = require("./routes/fileRoutes");
const folderRouter = require("./routes/folderRoutes");
const prisma = require("./config/prisma");
require("./middleware/passport");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/uploads", express.static("uploads"));
app.use(sessionConfig);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

app.get("/", async (req, res) => {
  let session = null;

  if (req.isAuthenticated()) {
    session = await prisma.session.findUnique({
      where: { sid: req.session.id },
    });
  }

  res.render("index", { user: req.user, sessionId: session?.sid });
});

app.listen(PORT);
