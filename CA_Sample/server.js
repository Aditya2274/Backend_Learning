import express from "express";
import fs from "fs/promises";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // IMPORTANT

app.get("/", (req, res) => {
  res.send(`
    <form method="post" action="/delete"> 
        <input name="filename" type="text" placeholder="Enter file name"/>
        <button>Delete</button>
    </form>
  `);
});

app.post("/delete", async (req, res) => {
  try {
    const filename = req.body.filename.trim();
    const filePath = process.cwd() + "/" + filename;

    await fs.unlink(filePath);

    res.send("File deleted successfully!");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Server is listening");
});
