import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../../public/data");

function loadJson(filename) {
  return JSON.parse(readFileSync(path.join(dataDir, filename), "utf-8"));
}

export const services = loadJson("services.json");
export const projects = loadJson("projects.json");
