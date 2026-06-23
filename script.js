const header = document.querySelector("[data-header]");
const rotator = document.querySelector("[data-rotator]");
const words = ["accounts meet data.", "GST meets clarity.", "Excel meets judgement.", "AI supports finance."];
let wordIndex = 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function rotateWords() {
  if (!rotator) return;
  wordIndex = (wordIndex + 1) % words.length;
  rotator.textContent = words[wordIndex];
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
window.setInterval(rotateWords, 2300);

const progressBar = document.querySelector("[data-progress]");
function updateProgress() {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.setProperty("--progress", `${pct}%`);
}
updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const cursorGlow = document.querySelector("[data-cursor-glow]");
if (cursorGlow && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGlow.style.setProperty("--mx", `${event.clientX}px`);
      cursorGlow.style.setProperty("--my", `${event.clientY}px`);
    },
    { passive: true }
  );
}

if (!prefersReducedMotion) {
  document.querySelectorAll(".button, .header-action").forEach((btn) => {
    btn.addEventListener("pointermove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      btn.style.transform = `translate(${x * 6}px, ${y * 6 - 2}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

document.querySelectorAll("[data-accordion] .support-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll("[data-accordion] .support-card").forEach((item) => {
      item.classList.toggle("is-open", item === card);
    });
  });
});

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

document.querySelector("[data-tilt-card]")?.addEventListener("pointermove", (event) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  card.style.setProperty("--tilt-y", `${x * 5}deg`);
  card.style.setProperty("--tilt-x", `${y * -5}deg`);
});

document.querySelector("[data-tilt-card]")?.addEventListener("pointerleave", (event) => {
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
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
