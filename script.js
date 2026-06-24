const header = document.querySelector("[data-header]");
const rotator = document.querySelector("[data-rotator]");
const words = ["accounts meet data.", "GST meets precision.", "Excel meets judgment.", "AI supports finance."];
let wordIndex = 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ROTATOR_INTERVAL_MS = 1700;

function rotateWords() {
  if (!rotator) return;
  wordIndex = (wordIndex + 1) % words.length;
  rotator.textContent = words[wordIndex];
}

window.setInterval(rotateWords, ROTATOR_INTERVAL_MS);

const blogRotator = document.querySelector("[data-blog-rotator]");
const blogHeadlines = [
  "Notes from the ledger.",
  "Thoughts between debits and credits.",
  "Where GST meets good sense.",
  "Reconciled thoughts, unfiled drafts.",
  "The audit trail of my brain.",
  "Ledger entries for life outside Tally.",
];
let blogHeadlineIndex = 0;

function rotateBlogHeadline() {
  if (!blogRotator) return;
  blogHeadlineIndex = (blogHeadlineIndex + 1) % blogHeadlines.length;
  blogRotator.textContent = blogHeadlines[blogHeadlineIndex];
}

if (blogRotator) window.setInterval(rotateBlogHeadline, ROTATOR_INTERVAL_MS);

// Scroll-spy: highlight the nav link for the section currently in view.
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNav() {
  if (!sections.length) return;
  let current = sections[0];
  const offset = 120;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top - offset <= 0) {
      current = section;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle("is-current", link.getAttribute("href") === `#${current.id}`);
  });
}

const progressBar = document.querySelector("[data-progress]");
const toTop = document.querySelector("[data-to-top]");

// Single rAF-batched scroll handler keeps header/progress/back-to-top/nav-spy
// from each triggering their own layout read on every scroll event.
let scrollTicking = false;
function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);

  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.setProperty("--progress", `${pct}%`);
  }

  toTop?.classList.toggle("is-visible", window.scrollY > 480);
  setActiveNav();

  scrollTicking = false;
}

function requestScrollUpdate() {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(onScroll);
}

onScroll();
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-skill]").forEach((skill) => {
      skill.classList.toggle("is-dimmed", filter !== "all" && skill.dataset.skill !== filter);
    });
  });
});

const toast = document.querySelector("[data-toast]");
document.querySelector("[data-copy-email]")?.addEventListener("click", async () => {
  await navigator.clipboard.writeText("jiteshsolankii2005@gmail.com");
  toast?.classList.add("is-visible");
  window.setTimeout(() => toast?.classList.remove("is-visible"), 1600);
});

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal-card").forEach((card, index) => {
  card.style.setProperty("--delay", `${(index % 4) * 70}ms`);
  observer.observe(card);
});

const skillCloud = document.querySelector(".skill-cloud");
if (skillCloud) {
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".skill-bar").forEach((bar, i) => {
          window.setTimeout(() => bar.classList.add("is-filled"), i * 35);
        });
        obs.disconnect();
      });
    },
    { threshold: 0.2 }
  );
  skillObserver.observe(skillCloud);
}
