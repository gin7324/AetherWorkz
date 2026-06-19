import { Router } from "express";

const router = Router();
const submissions = [];

router.post("/", (req, res) => {
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

  const submission = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  submissions.push(submission);
  console.log(`[Contact] New submission from ${submission.email}`);

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out. We'll get back to you soon.",
  });
});

export default router;
