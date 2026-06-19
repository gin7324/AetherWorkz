const servicesGrid = document.getElementById("services-grid");
const projectsList = document.getElementById("projects-list");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

// Mobile navigation
navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("is-open");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
  });
});

// Fetch services from API
async function loadServices() {
  try {
    const res = await fetch("/api/services");
    if (!res.ok) throw new Error("Failed to load services");
    const services = await res.json();

    servicesGrid.innerHTML = services
      .map(
        (s) => `
      <article class="card">
        <span class="card-icon" aria-hidden="true">${s.icon}</span>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.description)}</p>
      </article>
    `
      )
      .join("");
  } catch {
    servicesGrid.innerHTML =
      '<p class="section-lead">Unable to load services. Please refresh the page.</p>';
  }
}

// Fetch projects from API
async function loadProjects() {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to load projects");
    const projects = await res.json();

    projectsList.innerHTML = projects
      .map(
        (p) => `
      <article class="project-card">
        <div class="project-info">
          <p class="project-tagline">${escapeHtml(p.tagline)}</p>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.description)}</p>
        </div>
        <span class="project-status">${escapeHtml(p.status)}</span>
      </article>
    `
      )
      .join("");
  } catch {
    projectsList.innerHTML =
      '<p class="section-lead">Unable to load projects. Please refresh the page.</p>';
  }
}

// Contact form submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.textContent = "";
  formStatus.className = "form-status";

  const formData = new FormData(contactForm);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    formStatus.textContent = data.message;
    formStatus.classList.add("success");
    contactForm.reset();
  } catch (err) {
    formStatus.textContent = err.message;
    formStatus.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadServices();
loadProjects();
