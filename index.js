require("dotenv").config();
const express = require("express");
const path = require("node:path");
const passport = require("passport");
const sessionConfig = require("./config/sessionConfig");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authRouter = require("./routes/authRoutes")
const fileRouter = require("./routes/fileRoutes")
const folderRouter = require("./routes/folderRoutes")
require("./middleware/passport");

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(sessionConfig);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter)
app.use("/files", fileRouter)
app.use("/folders", folderRouter)

app.get("/", async (req, res) => {
  // const session = await prisma.session.findUnique({
  //   where: { sid: req?.session?.id },
  // });

  console.log(req.user)
  console.log(req.session)

  res.render("index", { user: req.user, sessionId: null});
});

app.listen(PORT);
