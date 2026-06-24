const BASE_STYLE = `
  :root {
    --bg: #f7f4ee; --surface: #fffdf9; --ink: #16191e; --muted: #5c6470;
    --line: rgba(22,25,30,0.14); --line-strong: rgba(22,25,30,0.34);
    --accent: #18634f; --accent-ink: #0d3c30; --accent-soft: #e2ece6;
    --rust: #a8461f; --gold: #97751f; --radius: 3px;
  }
  * { box-sizing: border-box; }
  body { position:relative; margin:0; overflow-x:hidden; background: var(--bg); color: var(--ink); font-family: "Instrument Sans", sans-serif; }
  .dashboard-wallpaper { position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none; background:
    linear-gradient(90deg, rgba(22,25,30,0.04) 1px, transparent 1px),
    linear-gradient(180deg, rgba(22,25,30,0.04) 1px, transparent 1px),
    linear-gradient(135deg, rgba(24,99,79,0.12), transparent 44%),
    linear-gradient(315deg, rgba(168,70,31,0.10), transparent 46%);
    background-size: 54px 54px, 54px 54px, 100% 100%, 100% 100%;
    animation: dashboard-grid-drift 22s linear infinite;
  }
  .dashboard-wallpaper span { position:absolute; bottom:-12vh; font-family:"IBM Plex Mono",monospace; font-size:clamp(0.95rem, 2.4vw, 1.8rem); font-weight:600; color:rgba(13,60,48,0.28); animation: dashboard-symbol-rise var(--duration, 18s) ease-in-out infinite; animation-delay:var(--delay, 0s); }
  .dashboard-wallpaper span:nth-child(3n) { color:rgba(168,70,31,0.24); }
  .dashboard-wallpaper span:nth-child(3n + 1) { color:rgba(151,117,31,0.24); }
  @keyframes dashboard-grid-drift { from { background-position:0 0, 0 0, 0 0, 0 0; } to { background-position:54px 54px, 54px 54px, 0 0, 0 0; } }
  @keyframes dashboard-symbol-rise {
    0% { transform: translateY(0) rotate(0deg); opacity:0; }
    14% { opacity:1; }
    86% { opacity:1; }
    100% { transform: translateY(-116vh) rotate(18deg); opacity:0; }
  }
  header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; padding: 18px 28px; border-bottom: 1px solid var(--line); background: rgba(255,253,249,0.88); backdrop-filter: blur(12px); }
  header h1 { font-family:"Fraunces",serif; font-size:1.3rem; margin:0; }
  .dash-nav { display:flex; align-items:center; gap:18px; }
  .dash-nav a { font-family:"IBM Plex Mono",monospace; font-size:0.8rem; color: var(--muted); text-decoration:none; }
  .dash-nav a:hover { color: var(--ink); }
  .dash-nav a.is-active { color: var(--accent-ink); font-weight:600; }
  main { max-width: 1100px; margin: 0 auto; padding: 28px; display:grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap:18px; }
  .card { background: var(--surface); border:1px solid var(--line); border-radius: var(--radius); padding:20px 22px; }
  .card h2 { font-family:"Fraunces",serif; font-size:1.05rem; margin:0 0 4px; }
  .card .sub { font-family:"IBM Plex Mono",monospace; font-size:0.7rem; color: var(--muted); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:14px; display:block; }
  .quest-group { margin-bottom:12px; }
  .quest-group strong { font-size:0.82rem; color: var(--accent-ink); }
  label.quest { display:flex; align-items:center; gap:8px; font-size:0.9rem; padding:4px 0; cursor:pointer; }
  .progress-bar { height:6px; background: var(--line); border-radius:999px; overflow:hidden; margin-top:10px; }
  .progress-bar span { display:block; height:100%; background: var(--accent); border-radius:999px; transition: width 300ms ease; }
  .pct-label { font-family:"IBM Plex Mono",monospace; font-size:0.72rem; color: var(--muted); margin-top:6px; display:block; }
  .row-input { display:flex; gap:6px; margin-bottom:10px; }
  .row-input input, .row-input select { flex:1; padding:7px 9px; border:1px solid var(--line-strong); border-radius: var(--radius); font-size:0.85rem; font-family:inherit; }
  .row-input button { padding:7px 12px; border:none; background: var(--ink); color:#fff; border-radius: var(--radius); cursor:pointer; font-size:0.82rem; font-weight:600; }
  ul.list-items { list-style:none; margin:0; padding:0; max-height:220px; overflow-y:auto; }
  ul.list-items li { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid var(--line); font-size:0.85rem; }
  ul.list-items li button { background:none; border:none; color: var(--rust); cursor:pointer; font-size:0.78rem; }
  .ledger-total { font-family:"IBM Plex Mono",monospace; font-weight:700; font-size:1.1rem; color: var(--accent); margin-top:10px; }
  textarea { width:100%; min-height:160px; border:1px solid var(--line-strong); border-radius: var(--radius); padding:10px; font-family:inherit; font-size:0.88rem; resize:vertical; }
  .saved-tag { font-family:"IBM Plex Mono",monospace; font-size:0.7rem; color: var(--muted); margin-top:6px; display:block; opacity:0; transition: opacity 300ms ease; }
  .saved-tag.is-visible { opacity:1; }
  .analytics-link, .nav-card-link { display:inline-block; margin-top:8px; padding:9px 16px; background: var(--ink); color:#fff; border-radius: var(--radius); text-decoration:none; font-size:0.85rem; font-weight:600; }
  .empty-note { color: var(--muted); font-size:0.82rem; font-style:italic; padding:6px 0; }
  .astra-widget { position:fixed; right:22px; bottom:22px; z-index:50; display:grid; gap:7px; justify-items:center; cursor:pointer; user-select:none; }
  .astra-widget img { width:76px; height:76px; object-fit:contain; filter: drop-shadow(0 0 20px rgba(24,99,79,0.28)); animation: astra-float 2.7s ease-in-out infinite; }
  .astra-widget span { max-width:132px; padding:6px 9px; border:1px solid var(--line); border-radius:var(--radius); background:rgba(255,253,249,0.92); color:var(--accent-ink); font-family:"IBM Plex Mono",monospace; font-size:0.68rem; text-align:center; box-shadow:0 10px 26px rgba(22,25,30,0.08); }
  .astra-panel { position:fixed; right:22px; bottom:122px; z-index:51; display:none; width:min(380px, calc(100vw - 28px)); max-height:min(620px, calc(100vh - 150px)); border:1px solid var(--line-strong); border-radius:var(--radius); background:var(--surface); box-shadow:0 22px 60px rgba(22,25,30,0.16); overflow:hidden; }
  .astra-panel.is-open { display:flex; flex-direction:column; }
  .astra-head { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:13px 15px; background:var(--ink); color:#fff; }
  .astra-head strong { font-family:"Fraunces",serif; font-size:1rem; }
  .astra-head span { display:block; margin-top:2px; color:rgba(255,255,255,0.72); font-family:"IBM Plex Mono",monospace; font-size:0.66rem; }
  .astra-close { border:0; background:transparent; color:#fff; cursor:pointer; font-size:1.25rem; }
  .astra-messages { flex:1; min-height:190px; overflow:auto; padding:13px; display:grid; gap:9px; }
  .astra-msg { padding:9px 11px; border-radius:var(--radius); font-size:0.86rem; line-height:1.45; }
  .astra-msg.from-astra { justify-self:start; background:var(--accent-soft); color:var(--accent-ink); }
  .astra-msg.from-user { justify-self:end; background:var(--ink); color:#fff; }
  .astra-actions { display:flex; flex-wrap:wrap; gap:7px; padding:0 13px 12px; }
  .astra-actions button { border:1px solid var(--line-strong); border-radius:var(--radius); background:var(--surface); color:var(--ink); cursor:pointer; font-family:"IBM Plex Mono",monospace; font-size:0.7rem; font-weight:600; padding:7px 9px; }
  .astra-form { display:flex; border-top:1px solid var(--line); }
  .astra-form input { flex:1; border:0; background:var(--surface); color:var(--ink); padding:11px 12px; font-family:inherit; font-size:0.86rem; }
  .astra-form button { border:0; background:var(--ink); color:#fff; padding:0 14px; font-weight:700; cursor:pointer; }
  @keyframes astra-float { 0%, 100% { transform:translateY(0) rotate(-2deg); } 50% { transform:translateY(-6px) rotate(2deg); } }
  @media (max-width: 680px) {
    .astra-widget { right:14px; bottom:14px; }
    .astra-widget img { width:64px; height:64px; }
    .astra-panel { right:14px; bottom:92px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .dashboard-wallpaper,
    .dashboard-wallpaper span,
    .astra-widget img { animation:none; }
  }
`;

const ASTRA_SCRIPT = `
(function () {
  const widget = document.getElementById("astra-widget");
  const panel = document.getElementById("astra-panel");
  const close = document.getElementById("astra-close");
  const form = document.getElementById("astra-form");
  const input = document.getElementById("astra-input");
  const messages = document.getElementById("astra-messages");
  if (!widget || !panel || !form || !input || !messages) return;

  const BRIDGE_URLS = ["http://127.0.0.1:8765/ask", "http://localhost:8765/ask"];

  function addMessage(from, text) {
    const el = document.createElement("div");
    el.className = "astra-msg from-" + from;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  }

  function pageContext() {
    return {
      title: document.title,
      url: location.href,
      cards: Array.from(document.querySelectorAll(".card h2")).map((el) => el.textContent.trim()).slice(0, 12),
    };
  }

  function localBrain(question) {
    const q = question.toLowerCase();
    if (/opencode|open code|bridge|connect/.test(q)) {
      return "I can connect to OpenCode only through your local bridge at 127.0.0.1:8765. If that bridge is running on this laptop, I will use it. If not, I stay in dashboard-helper mode.";
    }
    if (/study|learn|course|target|plan/.test(q)) {
      return "Learning partner mode: pick one course phase, finish the video notes, then mark 2-3 practical tasks. Keep today's target small enough to finish after work.";
    }
    if (/tabs|video|notes/.test(q)) {
      return "Tabs page is for learning with notes. Watch one focused video, write rough notes first, then rewrite 5 clean points at the end.";
    }
    if (/job|opportunity|pipeline/.test(q)) {
      return "Use the pipeline like a CRM: add company, current status, next action, and review it every evening for one tiny follow-up.";
    }
    if (/ledger|money|finance/.test(q)) {
      return "For your finance snapshot, log only what helps decisions: description, amount, and whether it was useful or avoidable. Too much detail becomes friction.";
    }
    return "I am Astra, your private learning partner. I can help plan study, explain dashboard sections, turn tasks into checklists, and use OpenCode when your local bridge is running.";
  }

  async function askBridge(question) {
    for (const url of BRIDGE_URLS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ question, context: pageContext(), source: "jitesh-private-dashboard-astra" }),
        });
        clearTimeout(timer);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.answer) return data.answer;
      } catch {}
    }
    return null;
  }

  async function askAstra(question) {
    addMessage("user", question);
    const waiting = document.createElement("div");
    waiting.className = "astra-msg from-astra";
    waiting.textContent = "Checking local OpenCode bridge...";
    messages.appendChild(waiting);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
    const bridgeAnswer = await askBridge(question);
    waiting.remove();
    addMessage("astra", bridgeAnswer || localBrain(question));
  }

  widget.addEventListener("click", () => {
    panel.classList.toggle("is-open");
    if (panel.classList.contains("is-open")) input.focus();
  });
  close.addEventListener("click", () => panel.classList.remove("is-open"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    askAstra(question);
  });
  document.querySelectorAll("[data-astra-prompt]").forEach((button) => {
    button.addEventListener("click", () => askAstra(button.dataset.astraPrompt));
  });
})();
`;

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'tabs', label: 'Tabs', href: '/dashboard/tabs' },
  { key: 'course', label: 'Course & Targets', href: '/dashboard/course' },
];

function renderShell({ title, navActive, bodyHtml, extraStyle = '', extraScript = '' }) {
  const navHtml = NAV_ITEMS.map(
    (item) => `<a href="${item.href}" class="${item.key === navActive ? 'is-active' : ''}">${item.label}</a>`
  ).join('\n      ');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>${BASE_STYLE}${extraStyle}</style>
</head>
<body>
  <div class="dashboard-wallpaper" aria-hidden="true">
    <span style="left:4%; --duration:17s; --delay:-2s;">₹</span>
    <span style="left:11%; --duration:21s; --delay:-9s;">%</span>
    <span style="left:18%; --duration:19s; --delay:-5s;">+</span>
    <span style="left:27%; --duration:24s; --delay:-14s;">GST</span>
    <span style="left:36%; --duration:18s; --delay:-7s;">✓</span>
    <span style="left:45%; --duration:23s; --delay:-11s;">AP</span>
    <span style="left:55%; --duration:20s; --delay:-3s;">AR</span>
    <span style="left:65%; --duration:22s; --delay:-16s;">₹</span>
    <span style="left:74%; --duration:18s; --delay:-6s;">%</span>
    <span style="left:84%; --duration:25s; --delay:-12s;">+</span>
    <span style="left:93%; --duration:20s; --delay:-8s;">✓</span>
  </div>
  <header>
    <h1>${title}</h1>
    <nav class="dash-nav">
      ${navHtml}
      <a href="/api/logout">Log out</a>
    </nav>
  </header>
  <main>
${bodyHtml}
  </main>
  <div class="astra-widget" id="astra-widget" aria-label="Open Astra learning partner">
    <img src="https://codexpet.xyz/brand/codie-logo.png" alt="Astra learning partner" draggable="false" />
    <span>Astra</span>
  </div>
  <section class="astra-panel" id="astra-panel" aria-label="Astra private learning partner">
    <div class="astra-head">
      <div><strong>Astra</strong><span>Private learning partner + local OpenCode bridge</span></div>
      <button class="astra-close" id="astra-close" type="button" aria-label="Close Astra">&times;</button>
    </div>
    <div class="astra-messages" id="astra-messages">
      <div class="astra-msg from-astra">I am Astra. I live only inside your private dashboard. I can help you learn, plan, and use OpenCode when your local bridge is running.</div>
    </div>
    <div class="astra-actions">
      <button type="button" data-astra-prompt="Make me a small study plan for tonight">Study plan</button>
      <button type="button" data-astra-prompt="Explain this dashboard page and what I should do first">Explain page</button>
      <button type="button" data-astra-prompt="Check if the local OpenCode bridge is connected">OpenCode check</button>
    </div>
    <form class="astra-form" id="astra-form">
      <input id="astra-input" type="text" placeholder="Ask Astra..." autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
  </section>
<script>${extraScript}${ASTRA_SCRIPT}</script>
</body>
</html>`;
}

module.exports = { renderShell };
