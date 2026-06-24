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

(function () {
  const brand = document.querySelector(".brand");
  if (!brand) return;
  const brandHref = brand.getAttribute("href");
  let clickTimes = [];
  let navTimer = null;

  brand.addEventListener("click", (e) => {
    e.preventDefault();
    const now = Date.now();
    clickTimes = clickTimes.filter((t) => now - t < 2000);
    clickTimes.push(now);
    clearTimeout(navTimer);

    if (clickTimes.length >= 5) {
      clickTimes = [];
      openLoginModal();
      return;
    }
    navTimer = setTimeout(() => {
      window.location.href = brandHref;
    }, 350);
  });

  let modalEl = null;

  function openLoginModal() {
    if (modalEl) {
      modalEl.classList.add("is-open");
      return;
    }
    const style = document.createElement("style");
    style.textContent = `
      .secret-login-overlay { position:fixed; inset:0; z-index:1000; display:none; align-items:center; justify-content:center; background:rgba(22,25,30,0.55); }
      .secret-login-overlay.is-open { display:flex; }
      .secret-login-box { background:var(--surface); border-radius:var(--radius); padding:28px 26px; width:min(320px, calc(100vw - 48px)); box-shadow:var(--shadow); }
      .secret-login-box h2 { margin:0 0 14px; font-family:"Fraunces",serif; font-size:1.15rem; }
      .secret-login-box input { width:100%; margin-bottom:10px; padding:9px 11px; border:1px solid var(--line-strong); border-radius:var(--radius); font-family:inherit; font-size:0.9rem; }
      .secret-login-box button { width:100%; padding:10px; border:none; border-radius:var(--radius); background:var(--ink); color:#fff; font-weight:700; cursor:pointer; }
      .secret-login-error { color:var(--rust); font-size:0.8rem; margin:0 0 10px; min-height:1em; }
    `;
    document.head.appendChild(style);

    modalEl = document.createElement("div");
    modalEl.className = "secret-login-overlay is-open";
    modalEl.innerHTML = `
      <div class="secret-login-box">
        <h2>Sign in</h2>
        <p class="secret-login-error" id="secret-login-error"></p>
        <form id="secret-login-form">
          <input type="text" id="secret-login-id" placeholder="ID" autocomplete="off" />
          <input type="password" id="secret-login-password" placeholder="Password" autocomplete="off" />
          <button type="submit">Enter</button>
        </form>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) modalEl.classList.remove("is-open");
    });

    document.getElementById("secret-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("secret-login-id").value;
      const password = document.getElementById("secret-login-password").value;
      const errorEl = document.getElementById("secret-login-error");
      errorEl.textContent = "";
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, password }),
        });
        if (res.ok) {
          window.location.href = "/" + ["dash", "board"].join("");
        } else {
          errorEl.textContent = "Incorrect ID or password.";
        }
      } catch {
        errorEl.textContent = "Couldn't reach the server. Try again.";
      }
    });
  }
})();
