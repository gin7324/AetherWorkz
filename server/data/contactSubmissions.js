import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultSubmissionsFile = path.join(__dirname, "contact-submissions.xlsx");
const submissionsFile = path.resolve(
  process.env.CONTACT_SUBMISSIONS_FILE || defaultSubmissionsFile
);

const headers = ["Submitted At", "Submission ID", "Name", "Email", "Message"];
let writeQueue = Promise.resolve();

export function getContactSubmissionsPath() {
  return submissionsFile;
}

export function appendContactSubmission(submission) {
  writeQueue = writeQueue.then(
    () => appendRow(submission),
    () => appendRow(submission)
  );

  return writeQueue;
}

async function appendRow(submission) {
  await ensureSubmissionsFile();

  const row = [
    submission.createdAt,
    submission.id,
    submission.name,
    submission.email,
    submission.message,
  ];

  await fs.appendFile(submissionsFile, `${row.map(formatCsvCell).join(",")}\n`, "utf8");
}

async function ensureSubmissionsFile() {
  await fs.mkdir(path.dirname(submissionsFile), { recursive: true });

  try {
    const stats = await fs.stat(submissionsFile);
    if (stats.size > 0) return;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const headerRow = headers.map(formatCsvCell).join(",");
  await fs.writeFile(submissionsFile, `\uFEFF${headerRow}\n`, { flag: "wx" }).catch(
    async (error) => {
      if (error.code !== "EEXIST") throw error;

      const stats = await fs.stat(submissionsFile);
      if (stats.size === 0) {
        await fs.writeFile(submissionsFile, `\uFEFF${headerRow}\n`, "utf8");
      }
    }
  );
}

function formatCsvCell(value) {
  return `"${sanitizeSpreadsheetValue(value).replace(/"/g, '""')}"`;
}

function sanitizeSpreadsheetValue(value) {
  const text = String(value ?? "");
  const trimmedStart = text.trimStart();

  if (/^[=+\-@]/.test(trimmedStart)) {
    return `'${text}`;
  }

  return text;
}
