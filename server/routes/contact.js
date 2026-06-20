import { Router } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = Router();
const submissions = [];

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailTo = process.env.EMAIL_TO || "genekenryp@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required.",
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  if (!emailUser || !emailPass) {
    return res.status(500).json({
      success: false,
      error: "Email service is not configured. Please set EMAIL_USER and EMAIL_PASS.",
    });
  }

  const submission = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  submissions.push(submission);
  console.log(`[Contact] New submission from ${submission.email}`);

  try {
    await transporter.sendMail({
      from: `"Aetherworkz Contact" <${emailUser}>`,
      to: emailTo,
      subject: `New contact from ${submission.name}`,
      text: `${submission.name} <${submission.email}> wrote:\n\n${submission.message}`,
      html: `<p><strong>Name:</strong> ${submission.name}</p><p><strong>Email:</strong> ${submission.email}</p><p><strong>Message:</strong></p><p>${submission.message}</p>`,
    });
  } catch (error) {
    console.error("[Contact] Email send failed", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send email. Please try again later.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out. We'll get back to you soon.",
  });
});

export default router;
