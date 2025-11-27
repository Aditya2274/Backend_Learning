import express from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import zlib from "zlib";
import path from "path";

const app = express();

const baseDir = process.cwd() + "/files";
fs.mkdirSync(baseDir, { recursive: true });

app.use(express.urlencoded({ extended: true }));

// -------------------- Home Page --------------------
app.get("/", (req, res) => {
  res.send(`
    <h2>Create File</h2>
    <form method="POST" action="/create">
      <input type="text" name="filename" placeholder="File name (example.txt)" required/><br><br>
      <textarea name="content" placeholder="Enter file content" required></textarea><br><br>
      <button>Create File (Async)</button>
    </form>

    <h2>Create File (Sync)</h2>
    <form method="POST" action="/create-sync">
      <input type="text" name="filename" placeholder="File name" required/><br><br>
      <textarea name="content" placeholder="File content" required></textarea><br><br>
      <button>Create File (Sync)</button>
    </form>

    <h2>Read File</h2>
    <form method="GET" action="/read">
      <input type="text" name="filename" placeholder="File name" required/>
      <button>Read</button>
    </form>

    <h2>Compress File</h2>
    <form method="GET" action="/compress">
      <input type="text" name="filename" placeholder="File name" required/>
      <button>Compress</button>
    </form>

    <h2>Decompress File</h2>
    <form method="GET" action="/decompress">
      <input type="text" name="filename" placeholder="File name.gz" required/>
      <button>Decompress</button>
    </form>
  `);
});

// -------------------- Create File (Async) --------------------
app.post("/create", async (req, res) => {
  const { filename, content } = req.body;

  const filePath = path.join(baseDir, filename);

  try {
    await fsPromises.writeFile(filePath, content);
    res.send("File created asynchronously!");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// -------------------- Create File (Sync) --------------------
app.post("/create-sync", (req, res) => {
  const { filename, content } = req.body;

  const filePath = path.join(baseDir, filename);

  try {
    fs.writeFileSync(filePath, content);



    res.send("File created synchronously!");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// -------------------- Read File --------------------
app.get("/read", async (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(baseDir, filename);

  try {
    const data = await fsPromises.readFile(filePath, "utf-8");
    res.send(`<h2>File Content:</h2><pre>${data}</pre>`);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// -------------------- Compress File --------------------
app.get("/compress", (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(baseDir, filename);
  const compressedPath = filePath + ".gz";

  const readStream = fs.createReadStream(filePath);
  const writeStream = fs.createWriteStream(compressedPath);
  const gzip = zlib.createGzip();

  readStream.pipe(gzip).pipe(writeStream);

  writeStream.on("finish", () => {
    res.send("File compressed successfully!");
    console.log(filePath) ;
    console.log(compressedPath) ;
  });

  writeStream.on("error", (err) => {
    res.send("Error: " + err.message);
  });
});

// -------------------- Decompress File --------------------
app.get("/decompress", (req, res) => {
  const filename = req.query.filename; // example: file.txt.gz
  const compressedPath = filename + ".gz";
  if (!compressedPath.endsWith(".gz")) {
    return res.send("Error: Please provide a valid .gz file (example: file.txt.gz)");
  }

  const filePath = path.join(baseDir, compressedPath);
  const decompressedPath = filename.replace(".gz", "");

  const readStream = fs.createReadStream(filePath);
  const writeStream = fs.createWriteStream(decompressedPath);
  const gunzip = zlib.createGunzip();

  readStream.on("error", (err) => {
    res.send("Error while reading compressed file: " + err.message);
  });

  gunzip.on("error", (err) => {
    res.send("Error while decompressing: " + err.message + "<br>File may be corrupted or not a gzip file.");
  });

  writeStream.on("finish", () => {
    res.send("File decompressed successfully!");
  });

  readStream.pipe(gunzip).pipe(writeStream);
});

// -------------------- Start Server --------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
