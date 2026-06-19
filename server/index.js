import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import contactRouter from "./routes/contact.js";
import apiRouter from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes before static files and SPA fallback
app.use("/api", apiRouter);
app.use("/api/contact", contactRouter);

app.use(express.static(publicDir));

app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Aetherworkz running at http://localhost:${PORT}`);
});
