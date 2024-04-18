const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const multer = require("multer");
const path = require("path");
const createUniqueFileName = require("./middleware/uniqueFileName");
const getFolderStructure = require("./middleware/folderStructure");

const app = express();

function unCaughtExceptionhandler(ex) {
  console.error(ex);
}
process.on("uncaughtException", unCaughtExceptionhandler);
process.on("uhandledRejection", unCaughtExceptionhandler);

const rootFolder = "data/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(rootFolder, req.query.path);
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = createUniqueFileName(
      path.join(__dirname, rootFolder),
      file.originalname
    );
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  if (req.query.path === undefined)
    return res.status(400).send("Path is required");
  if (req.query.path.split(".").length > 2)
    return res.status(400).send("Multiple dots in path are not accepted");
  try {
    await fs.stat(rootFolder + req.query.path);
  } catch (err) {
    return res.status(400).send("Invalid Path");
  }
  next();
});

app.get("/folder", async (req, res) => {
  const folderStructure = await getFolderStructure(
    path.normalize(rootFolder + req.query.path)
  );
  res.send(folderStructure);
});

app.get("/file", (req, res) => {
  const filePath = path.resolve(path.join(rootFolder, req.query.path));
  res.sendFile(path.normalize(filePath));
});

app.post("/addFile", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.send("File uploaded successfully.");
});

app.post("/addFolder", async (req, res) => {
  if (!(req.query.name && req.query.name.trim()))
    return res.status(400).send("Invalid folder name");
  try {
    const folderPath = path.resolve(
      path.join(rootFolder, req.query.path, req.query.name)
    );
    await fs.mkdir(folderPath, { recursive: true });
    res.send("Folder created successfully");
  } catch (error) {
    console.error("Error creating folder", error);
    res.status(500).send("Error creating folder");
  }
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(500).send("Something Failed");
  }
  next();
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listning at port ${port}`));
