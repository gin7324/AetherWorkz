import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import contactRouter from "./routes/contact.js";
import apiRouter from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", apiRouter);
app.use("/api/contact", contactRouter);

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Aetherworkz running at http://localhost:${PORT}`);
});
