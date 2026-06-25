import { Router } from "express";
import crypto from "crypto";
import { access } from "fs/promises";
import {
  appendContactSubmission,
  getContactSubmissionsPath,
} from "../data/contactSubmissions.js";

const router = Router();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailTo = process.env.EMAIL_TO || "genekenryp@gmail.com";
const contactExportToken = process.env.CONTACT_EXPORT_TOKEN;

let transporterPromise;

router.get("/submissions.csv", async (req, res) => {
  if (!isAuthorizedExportRequest(req)) {
    return res.status(401).json({
      success: false,
      error: "A valid contact export token is required.",
    });
  }

  const submissionsPath = getContactSubmissionsPath();

  try {
    await access(submissionsPath);
  } catch {
    return res.status(404).json({
      success: false,
      error: "No contact submissions have been saved yet.",
    });
  }

  res.download(submissionsPath, "contact-submissions.csv");
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  const submissionName = typeof name === "string" ? name.trim() : "";
  const submissionEmail = typeof email === "string" ? email.trim() : "";
  const submissionMessage = typeof message === "string" ? message.trim() : "";

  if (!submissionName || !submissionEmail || !submissionMessage) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(submissionEmail)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  const submission = {
    id: crypto.randomUUID(),
    name: submissionName,
    email: submissionEmail,
    message: submissionMessage,
    createdAt: new Date().toISOString(),
  };

  try {
    await appendContactSubmission(submission);
    console.log(
      `[Contact] Saved submission from ${submission.email} to ${getContactSubmissionsPath()}`
    );
  } catch (error) {
    console.error("[Contact] Spreadsheet save failed", error);
    return res.status(500).json({
      success: false,
      error: "Failed to save your message. Please try again later.",
    });
  }

  try {
    const emailResult = await sendContactEmail(submission);
    if (!emailResult.sent) {
      console.warn(`[Contact] Email skipped: ${emailResult.reason}`);
    }
  } catch (error) {
    console.error("[Contact] Email send failed", error);
  }

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out. Your message has been received.",
  });
});

function isAuthorizedExportRequest(req) {
  if (!contactExportToken) return false;

  const authHeader = req.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const queryToken = typeof req.query.token === "string" ? req.query.token : "";

  return bearerToken === contactExportToken || queryToken === contactExportToken;
}

async function sendContactEmail(submission) {
  if (!emailUser || !emailPass) {
    return { sent: false, reason: "EMAIL_USER and EMAIL_PASS are not configured" };
  }

  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `"Aetherworkz Contact" <${emailUser}>`,
    to: emailTo,
    subject: `New contact from ${submission.name}`,
    text: `${submission.name} <${submission.email}> wrote:\n\n${submission.message}`,
    html: [
      `<p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>`,
      `<p><strong>Message:</strong></p>`,
      `<p>${escapeHtml(submission.message).replace(/\n/g, "<br />")}</p>`,
    ].join(""),
  });

  return { sent: true };
}

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = import("nodemailer").then((module) => {
      const nodemailer = module.default || module;

      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    });
  }

  return transporterPromise;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default router;
