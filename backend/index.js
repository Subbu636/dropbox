const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const multer = require("multer");
const path = require("path");
const createUniqueFileName = require("./middleware/uniqueFileName");

const app = express();
const router = app.use(express.json());

function unCaughtExceptionhandler(ex) {
  console.error(ex.message, ex);
}
process.on("uncaughtException", unCaughtExceptionhandler);
process.on("uhandledRejection", unCaughtExceptionhandler);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data/");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = createUniqueFileName(
      path.join(__dirname, "data/"),
      file.originalname
    );
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage: storage });

const directoryPath = "./data/";

// cors middleware
app.use(cors());

// handling list of files request
app.get("/files", async (_, res) => {
  try {
    const entries = await fs.readdir(directoryPath);
    res.send(entries);
  } catch (ex) {
    console.error(ex.message, ex);
    res.status(500).send("Someting Failed");
  }
});

// handling specific file access request
app.get("/files/:fileName", (req, res) => {
  let filePath = path.resolve(directoryPath, req.params.fileName);
  if (!filePath) res.status(400).send("No such file in directory");
  res.sendFile(filePath);
});

// handling upload request
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send("File uploaded successfully.");
});

// Listening at a port
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listning at port ${port}`));
