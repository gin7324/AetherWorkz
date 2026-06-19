import { Router } from "express";

const router = Router();

const services = [
  {
    id: "product-engineering",
    title: "Product Engineering",
    description:
      "End-to-end development of web and mobile products — from architecture to launch.",
    icon: "◈",
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    description:
      "Scalable backends, DevOps pipelines, and cloud-native systems built for reliability.",
    icon: "◇",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description:
      "Practical AI features woven into your product — automation, search, and intelligent workflows.",
    icon: "◆",
  },
  {
    id: "design-systems",
    title: "Design Systems",
    description:
      "Cohesive UI libraries and design tokens that keep your product consistent as it grows.",
    icon: "▣",
  },
];

const projects = [
  {
    id: "atlas-platform",
    name: "Atlas Platform",
    tagline: "Internal tooling suite",
    description:
      "A modular dashboard framework for teams managing complex operational workflows.",
    status: "In development",
  },
  {
    id: "nexus-api",
    name: "Nexus API",
    tagline: "Unified data layer",
    description:
      "A high-performance API gateway connecting disparate services into a single interface.",
    status: "Beta",
  },
  {
    id: "forge-cli",
    name: "Forge CLI",
    tagline: "Developer productivity",
    description:
      "Command-line tooling that accelerates scaffolding, testing, and deployment workflows.",
    status: "Coming soon",
  },
];

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
