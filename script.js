const header = document.querySelector("[data-header]");
const rotator = document.querySelector("[data-rotator]");
const words = ["accounts meet data.", "GST meets clarity.", "Excel meets judgement.", "AI supports finance."];
let wordIndex = 0;

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

document.querySelectorAll(".reveal-card").forEach((card) => observer.observe(card));
