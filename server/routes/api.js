import { Router } from "express";
import { services, projects } from "../data/load.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", company: "Aetherworkz", timestamp: new Date().toISOString() });
});

router.get("/services", (_req, res) => {
  res.json(services);
});

router.get("/projects", (_req, res) => {
  res.json(projects);
});

export default router;
