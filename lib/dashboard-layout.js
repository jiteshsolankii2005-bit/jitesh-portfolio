const BASE_STYLE = `
  :root {
    --bg: #f7f4ee; --surface: #fffdf9; --ink: #16191e; --muted: #5c6470;
    --line: rgba(22,25,30,0.14); --line-strong: rgba(22,25,30,0.34);
    --accent: #18634f; --accent-ink: #0d3c30; --accent-soft: #e2ece6;
    --rust: #a8461f; --gold: #97751f; --radius: 3px;
  }
  * { box-sizing: border-box; }
  body { position:relative; margin:0; overflow-x:hidden; background:
    radial-gradient(circle at 16% 10%, rgba(24,99,79,0.10), transparent 32%),
    radial-gradient(circle at 86% 0%, rgba(151,117,31,0.09), transparent 30%),
    var(--bg);
    color: var(--ink); font-family: "Instrument Sans", sans-serif; }
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
  header { position:sticky; top:0; z-index:30; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; padding: 18px 28px; border-bottom: 1px solid var(--line); background: rgba(255,253,249,0.88); backdrop-filter: blur(12px); }
  header h1 { font-family:"Fraunces",serif; font-size:1.3rem; margin:0; }
  .dash-actions { display:flex; align-items:center; flex-wrap:wrap; gap:12px; }
  .dash-nav { display:flex; align-items:center; gap:18px; }
  .dash-nav a { font-family:"IBM Plex Mono",monospace; font-size:0.8rem; color: var(--muted); text-decoration:none; }
  .dash-nav a:hover { color: var(--ink); }
  .dash-nav a.is-active { color: var(--accent-ink); font-weight:600; }
  .dash-theme-toggle { display:inline-grid; width:40px; height:40px; place-items:center; border:1px solid var(--line-strong); border-radius:var(--radius); background:var(--surface); color:var(--ink); cursor:pointer; font-family:"IBM Plex Mono",monospace; font-weight:700; line-height:1; }
  .dash-theme-toggle:hover { border-color:var(--accent); box-shadow:0 0 18px rgba(24,99,79,0.16); }
  main { max-width: 1100px; margin: 0 auto; padding: 28px; display:grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap:18px; }
  .card { position:relative; overflow:hidden; background: var(--surface); border:1px solid var(--line); border-radius: var(--radius); padding:20px 22px; transition:transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease; }
  .card::before { content:""; position:absolute; inset:0 0 auto 0; height:3px; background:linear-gradient(90deg, var(--accent), var(--gold), var(--rust)); opacity:0.74; }
  .card:hover { transform:translateY(-2px); border-color:var(--line-strong); box-shadow:0 18px 42px rgba(22,25,30,0.08); }
  .card h2 { font-family:"Fraunces",serif; font-size:1.05rem; margin:0 0 4px; }
  .card .sub { font-family:"IBM Plex Mono",monospace; font-size:0.7rem; color: var(--muted); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:14px; display:block; }
  .quest-group { margin-bottom:12px; }
  .quest-group strong { font-size:0.82rem; color: var(--accent-ink); }
  label.quest { display:flex; align-items:center; gap:8px; font-size:0.9rem; padding:4px 0; cursor:pointer; }
  .progress-bar { height:6px; background: var(--line); border-radius:999px; overflow:hidden; margin-top:10px; }
  .progress-bar span { display:block; height:100%; background: var(--accent); border-radius:999px; transition: width 300ms ease; }
  .pct-label { font-family:"IBM Plex Mono",monospace; font-size:0.72rem; color: var(--muted); margin-top:6px; display:block; }
  .row-input { display:flex; flex-wrap:wrap; align-items:stretch; gap:6px; margin-bottom:10px; max-width:100%; }
  .row-input input, .row-input select { min-width:0; flex:1 1 130px; max-width:100%; padding:7px 9px; border:1px solid var(--line-strong); border-radius: var(--radius); font-size:0.85rem; font-family:inherit; }
  .row-input input[type="number"] { flex:0 1 138px; }
  .row-input select { flex:0 1 124px; }
  .row-input button { flex:0 0 auto; min-width:74px; padding:7px 12px; border:none; background: var(--ink); color:#fff; border-radius: var(--radius); cursor:pointer; font-size:0.82rem; font-weight:600; }
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
  .astra-panel { position:fixed; right:22px; bottom:122px; z-index:51; display:none; width:min(420px, calc(100vw - 28px)); max-height:min(650px, calc(100vh - 150px)); border:1px solid var(--line-strong); border-radius:var(--radius); background:var(--surface); box-shadow:0 22px 60px rgba(22,25,30,0.16); overflow:hidden; }
  .astra-panel.is-open { display:flex; flex-direction:column; }
  .astra-head { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:13px 15px; background:var(--ink); color:#fff; }
  .astra-head strong { font-family:"Fraunces",serif; font-size:1rem; }
  .astra-head span { display:block; margin-top:2px; color:rgba(255,255,255,0.72); font-family:"IBM Plex Mono",monospace; font-size:0.66rem; }
  .astra-close { border:0; background:transparent; color:#fff; cursor:pointer; font-size:1.25rem; }
  .astra-status { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:6px; padding:9px 13px 0; }
  .astra-status span { border:1px solid var(--line); border-radius:var(--radius); padding:6px 7px; color:var(--muted); font-family:"IBM Plex Mono",monospace; font-size:0.62rem; text-align:center; }
  .astra-messages { flex:1; min-height:210px; overflow:auto; padding:13px; display:grid; gap:9px; }
  .astra-msg { padding:9px 11px; border-radius:var(--radius); font-size:0.86rem; line-height:1.45; }
  .astra-msg.from-astra { justify-self:start; background:var(--accent-soft); color:var(--accent-ink); }
  .astra-msg.from-user { justify-self:end; background:var(--ink); color:#fff; }
  .astra-msg ul { margin:8px 0 0; padding-left:18px; }
  .astra-action-link { display:inline-flex; margin-top:7px; padding:7px 9px; background:var(--ink); color:#fff; border-radius:var(--radius); text-decoration:none; font-family:"IBM Plex Mono",monospace; font-size:0.68rem; font-weight:700; }
  .astra-actions { display:flex; flex-wrap:wrap; gap:7px; padding:0 13px 12px; }
  .astra-actions button { border:1px solid var(--line-strong); border-radius:var(--radius); background:var(--surface); color:var(--ink); cursor:pointer; font-family:"IBM Plex Mono",monospace; font-size:0.7rem; font-weight:600; padding:7px 9px; }
  .astra-form { display:flex; border-top:1px solid var(--line); }
  .astra-form input { flex:1; border:0; background:var(--surface); color:var(--ink); padding:11px 12px; font-family:inherit; font-size:0.86rem; }
  .astra-form button { border:0; background:var(--ink); color:#fff; padding:0 14px; font-weight:700; cursor:pointer; }
  html[data-dashboard-theme="midnight"] {
    color-scheme: dark;
    --bg: #101410; --surface: #171d19; --ink: #f6f0df; --muted: #b8c7bb;
    --line: rgba(139,216,189,0.18); --line-strong: rgba(139,216,189,0.42);
    --accent: #8bd8bd; --accent-ink: #dff8ec; --accent-soft: rgba(139,216,189,0.14);
    --rust: #f09a72; --gold: #e1c76f;
  }
  html[data-dashboard-theme="midnight"] body { background:radial-gradient(circle at 20% 12%, rgba(139,216,189,0.12), transparent 30%), var(--bg); }
  html[data-dashboard-theme="midnight"] header { background:rgba(16,20,16,0.86); box-shadow:0 0 28px rgba(139,216,189,0.12); }
  html[data-dashboard-theme="midnight"] .dashboard-wallpaper { background:
    linear-gradient(90deg, rgba(139,216,189,0.06) 1px, transparent 1px),
    linear-gradient(180deg, rgba(139,216,189,0.06) 1px, transparent 1px),
    radial-gradient(circle at 18% 14%, rgba(139,216,189,0.18), transparent 34%),
    radial-gradient(circle at 82% 18%, rgba(225,199,111,0.12), transparent 30%),
    linear-gradient(145deg, rgba(11,15,12,0.92), rgba(16,20,16,0.98));
    background-size:54px 54px, 54px 54px, 100% 100%, 100% 100%, 100% 100%;
  }
  html[data-dashboard-theme="midnight"] .dashboard-wallpaper span { color:rgba(139,216,189,0.42); text-shadow:0 0 18px rgba(139,216,189,0.42); }
  html[data-dashboard-theme="midnight"] .card,
  html[data-dashboard-theme="midnight"] .astra-panel,
  html[data-dashboard-theme="midnight"] .astra-widget span {
    background:rgba(23,29,25,0.92); box-shadow:0 0 0 1px rgba(139,216,189,0.08), 0 0 32px rgba(139,216,189,0.12);
  }
  html[data-dashboard-theme="midnight"] .dash-theme-toggle,
  html[data-dashboard-theme="midnight"] .row-input button,
  html[data-dashboard-theme="midnight"] .analytics-link,
  html[data-dashboard-theme="midnight"] .nav-card-link,
  html[data-dashboard-theme="midnight"] .astra-head,
  html[data-dashboard-theme="midnight"] .astra-form button,
  html[data-dashboard-theme="midnight"] .astra-msg.from-user,
  html[data-dashboard-theme="midnight"] .astra-action-link {
    background:linear-gradient(135deg, #8bd8bd, #e1c76f); color:#101410; border-color:rgba(139,216,189,0.66);
  }
  html[data-dashboard-theme="midnight"] .astra-status span { background:rgba(16,20,16,0.58); color:rgba(246,240,223,0.74); border-color:rgba(139,216,189,0.18); }
  html[data-dashboard-theme="midnight"] input,
  html[data-dashboard-theme="midnight"] textarea,
  html[data-dashboard-theme="midnight"] select { background:rgba(16,20,16,0.92); color:var(--ink); border-color:var(--line-strong); }
  html[data-dashboard-theme="midnight"] .astra-widget img { filter:drop-shadow(0 0 22px rgba(139,216,189,0.68)); }
  @keyframes astra-float { 0%, 100% { transform:translateY(0) rotate(-2deg); } 50% { transform:translateY(-6px) rotate(2deg); } }
  @media (max-width: 680px) {
    header { padding:14px; }
    .dash-actions { width:100%; align-items:flex-start; }
    .dash-nav { flex:1; overflow-x:auto; padding-bottom:4px; }
    .dash-nav a { flex:0 0 auto; }
    main { grid-template-columns:1fr; padding:18px 14px 96px; }
    .row-input { display:grid; grid-template-columns:1fr; }
    .row-input input,
    .row-input input[type="number"],
    .row-input select,
    .row-input button { width:100%; min-width:0; max-width:100%; }
    .row-input input[type="number"] { max-width:none !important; }
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

  const BRIDGES = [
    { name: "OpenCode", kind: "ask", url: "http://127.0.0.1:8765/ask" },
    { name: "OpenCode", kind: "ask", url: "http://localhost:8765/ask" },
    { name: "Astra Bridge", kind: "ask", url: "http://127.0.0.1:8766/ask" },
    { name: "Ollama", kind: "ollama", url: "http://127.0.0.1:11434/api/chat" },
    { name: "LM Studio", kind: "openai-compatible", url: "http://127.0.0.1:1234/v1/chat/completions" },
  ];

  const DASHBOARD_LINKS = {
    dashboard: "/dashboard",
    home: "/dashboard",
    tabs: "/dashboard/tabs",
    video: "/dashboard/tabs",
    course: "/dashboard/course",
    target: "/dashboard/course",
    targets: "/dashboard/course",
  };

  function addMessage(from, text) {
    const el = document.createElement("div");
    el.className = "astra-msg from-" + from;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  }

  function addRichMessage(from, html) {
    const el = document.createElement("div");
    el.className = "astra-msg from-" + from;
    el.innerHTML = html;
    messages.appendChild(el);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
    return el;
  }

  function addActionLink(label, href) {
    return '<a class="astra-action-link" href="' + href + '">' + label + "</a>";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pageContext() {
    const cards = Array.from(document.querySelectorAll(".card")).map((card) => ({
      title: card.querySelector("h2")?.textContent.trim() || "",
      label: card.querySelector(".sub")?.textContent.trim() || "",
      progress: card.querySelector(".pct-label")?.textContent.trim() || "",
      empty: !!card.querySelector(".empty-note"),
    })).filter((card) => card.title).slice(0, 14);
    return {
      title: document.title,
      url: location.href,
      theme: document.documentElement.dataset.dashboardTheme || "light",
      cards,
    };
  }

  function setDashboardTheme(theme) {
    const safeTheme = theme === "midnight" ? "midnight" : "light";
    document.documentElement.dataset.dashboardTheme = safeTheme;
    try { localStorage.setItem("dashboard.theme", safeTheme); } catch {}
    const button = document.querySelector("[data-dashboard-theme-toggle]");
    if (button) {
      button.textContent = safeTheme === "midnight" ? "☀" : "☾";
      button.setAttribute("aria-label", safeTheme === "midnight" ? "Switch to light dashboard theme" : "Switch to dark dashboard theme");
      button.title = safeTheme === "midnight" ? "Light theme" : "Dark theme";
    }
    return safeTheme === "midnight" ? "Midnight dashboard is on." : "Light dashboard is back.";
  }

  function draftMailUrls() {
    const to = "jiteshsolankii2005@gmail.com";
    const subject = "Private dashboard follow-up";
    const body = ["Hi Jitesh,", "", "Quick note from my dashboard:", "", "[Write the thing here]", ""].join("\\n");
    const gmail = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
    return {
      gmail: "https://mail.google.com/mail/?" + gmail.toString(),
      mailto: "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body),
    };
  }

  function explainCurrentPage() {
    const context = pageContext();
    const items = context.cards.map((card) => {
      const status = card.progress ? " — " + card.progress : card.empty ? " — empty right now" : "";
      return "<li><strong>" + escapeHtml(card.title) + "</strong>" + escapeHtml(status) + "</li>";
    }).join("");
    return "You are on <strong>" + escapeHtml(context.title) + "</strong>. I can see these working blocks:<ul>" + items + "</ul>";
  }

  function localPlan(kind) {
    if (kind === "night") {
      return "Tonight plan:<ul><li>Pick one finance learning task only.</li><li>Spend 25 minutes on notes or video.</li><li>Log one practical takeaway in Content Ideas or video notes.</li><li>Close with tomorrow's smallest next action.</li></ul>";
    }
    if (kind === "job") {
      return "Opportunity workflow:<ul><li>Add the company in the tracker.</li><li>Set the current stage honestly.</li><li>Write one next action: apply, follow up, improve resume, or research.</li><li>Review the tracker once daily, not randomly all day.</li></ul>";
    }
    if (kind === "learning") {
      return "Learning workflow:<ul><li>Watch one focused section.</li><li>Write rough notes while watching.</li><li>Turn notes into 5 clean bullet points.</li><li>Ask: where can this help in Tally, GST, Excel, or work?</li></ul>";
    }
    return "Smart dashboard mode:<ul><li>Track only useful inputs.</li><li>Keep every page action small.</li><li>Use Astra to convert messy thoughts into checklists.</li><li>Use local AI bridge only when it is running on your laptop.</li></ul>";
  }

  function accountingLesson(question) {
    const q = question.toLowerCase();
    if (/\\b(accounting equation|accounting equations|equation|assets?|liabilit(?:y|ies)|equity|capital)\\b/.test(q)) {
      return "Phase 1 — Accounting Equation:<ul><li><strong>Formula:</strong> Assets = Liabilities + Equity.</li><li><strong>Meaning:</strong> what the business owns = what it owes outsiders + what belongs to the owner.</li><li><strong>Example:</strong> you start business with ₹50,000 cash. Assets ₹50,000 = Capital ₹50,000.</li><li><strong>If you take a loan:</strong> cash increases and liability increases. Assets ₹80,000 = Loan ₹30,000 + Capital ₹50,000.</li><li><strong>Golden idea:</strong> every transaction affects at least two things, but the equation must always balance.</li></ul>";
    }
    if (/\\b(debit|credit|dr\\.?|cr\\.?)\\b/.test(q)) {
      return "Phase 1 — Debit and Credit rules:<ul><li><strong>Assets/Expenses:</strong> increase by Debit, decrease by Credit.</li><li><strong>Liabilities/Capital/Income:</strong> increase by Credit, decrease by Debit.</li><li><strong>Simple example:</strong> buy furniture for cash: Furniture A/c Dr, Cash A/c Cr.</li><li>Do not memorize blindly. First ask: what came in, what went out, and which account type changed?</li></ul>";
    }
    if (/\\b(golden rules?|journal|entry|entries|narration)\\b/.test(q)) {
      return "Phase 1 — Journal entry basics:<ul><li>Identify the two accounts involved.</li><li>Classify each account: asset, liability, capital, income, or expense.</li><li>Apply debit/credit rule.</li><li>Write narration in plain language: why this entry happened.</li><li>Example: Rent paid ₹5,000 by cash → Rent A/c Dr ₹5,000, To Cash A/c ₹5,000.</li></ul>";
    }
    if (/\\b(trial balance|ledger|posting|t account|t-account)\\b/.test(q)) {
      return "Phase 1 — Ledger and Trial Balance:<ul><li>Journal is the first record. Ledger groups entries account-wise.</li><li>Posting means moving each journal line to the related ledger account.</li><li>Trial balance checks whether total debits equal total credits.</li><li>If it does not match, search for posting, amount, side, or totaling mistakes.</li></ul>";
    }
    return null;
  }

  function runLocalAction(question) {
    const q = question.toLowerCase();
    if (/\\b(dark|night|midnight|glow)\\b/.test(q)) return { html: setDashboardTheme("midnight") };
    if (/\\b(light|classic|reset theme|normal theme)\\b/.test(q)) return { html: setDashboardTheme("light") };

    const lesson = accountingLesson(question);
    if (lesson) return { html: lesson };

    if (/\\b(explain|summarize|summary|what is this page)\\b/.test(q)) return { html: explainCurrentPage() };
    if (/\\b(today|tonight|plan|routine)\\b/.test(q)) return { html: localPlan("night") };
    if (/\\b(job|opportunity|pipeline|apply|application)\\b/.test(q)) return { html: localPlan("job") };
    if (/\\b(study|learn|course|video|notes|target)\\b/.test(q)) return { html: localPlan("learning") };

    for (const [key, href] of Object.entries(DASHBOARD_LINKS)) {
      if (new RegExp("\\\\b(open|go|show|take me|navigate).*\\\\b" + key + "\\\\b|\\\\b" + key + "\\\\b.*\\\\b(open|go|show|take me|navigate)\\\\b").test(q)) {
        return { html: "Opening " + escapeHtml(key) + ". " + addActionLink("Open " + escapeHtml(key), href), navigate: href };
      }
    }

    if (/\\b(email|gmail|mail|contact|draft)\\b/.test(q)) {
      const urls = draftMailUrls();
      return { html: "I made safe draft links. I will not auto-send anything." + addActionLink("Open Gmail draft", urls.gmail) + addActionLink("Open email app", urls.mailto) };
    }

    if (/\\b(opencode|open code|ollama|lm studio|local ai|bridge|connect)\\b/.test(q)) {
      return { html: "I can try local tools in this order: OpenCode bridge on port 8765, Astra bridge on 8766, Ollama on 11434, then LM Studio on 1234. If nothing is running, I stay in local dashboard-helper mode." };
    }

    return null;
  }

  function localBrain(question) {
    const q = question.toLowerCase();
    const lesson = accountingLesson(question);
    if (lesson) return lesson.replace(/<[^>]+>/g, " ");
    if (/\\b(problem|stuck|error|fix|debug)\\b/.test(q)) {
      return "Debug mode: tell me the exact page, what you clicked, what you expected, and what happened. I will turn it into likely cause + next test.";
    }
    if (/\\b(account|gst|tally|excel|reconcile|ledger)\\b/.test(q)) {
      return "Finance helper mode: break the work into source document, entry, check, and evidence. For accounting work, I will keep it practical and beginner-friendly.";
    }
    if (/\\b(personal|private|safe|security|secret)\\b/.test(q)) {
      return "Private-space rule: I can help inside this dashboard, but I will not expose private routes, cookies, passwords, or hidden dashboard details to public visitors.";
    }
    return "I am Astra, your private learning partner. I can explain dashboard pages, plan your night, guide study, draft safe follow-ups, change dashboard theme, open private tabs, and try local AI bridges when they are running.";
  }

  function systemPrompt() {
    return "You are Astra, Jitesh Solanki's private dashboard learning partner. Be concise, practical, privacy-safe, beginner-friendly for accounting, and turn vague requests into next actions. Never reveal passwords, cookies, hidden routes, or private dashboard internals to outsiders.";
  }

  async function postJson(url, body, signal) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json();
  }

  async function askBridge(question) {
    const context = pageContext();
    for (const bridge of BRIDGES) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2800);
        let data = null;
        if (bridge.kind === "ask") {
          data = await postJson(bridge.url, { question, context, system: systemPrompt(), source: "jitesh-private-dashboard-astra" }, controller.signal);
          clearTimeout(timer);
          if (data?.answer) return { source: bridge.name, answer: data.answer };
        } else if (bridge.kind === "ollama") {
          data = await postJson(bridge.url, {
            model: localStorage.getItem("astra.ollama.model") || "llama3.2",
            stream: false,
            messages: [
              { role: "system", content: systemPrompt() },
              { role: "user", content: question + "\\n\\nDashboard context: " + JSON.stringify(context) },
            ],
          }, controller.signal);
          clearTimeout(timer);
          if (data?.message?.content) return { source: bridge.name, answer: data.message.content };
        } else if (bridge.kind === "openai-compatible") {
          data = await postJson(bridge.url, {
            model: localStorage.getItem("astra.lmstudio.model") || "local-model",
            temperature: 0.3,
            messages: [
              { role: "system", content: systemPrompt() },
              { role: "user", content: question + "\\n\\nDashboard context: " + JSON.stringify(context) },
            ],
          }, controller.signal);
          clearTimeout(timer);
          if (data?.choices?.[0]?.message?.content) return { source: bridge.name, answer: data.choices[0].message.content };
        }
        clearTimeout(timer);
      } catch {}
    }
    return null;
  }

  async function askAstra(question) {
    addMessage("user", question);
    const localAction = runLocalAction(question);
    if (localAction) {
      addRichMessage("astra", localAction.html);
      if (localAction.navigate) window.setTimeout(() => { window.location.href = localAction.navigate; }, 500);
      return;
    }

    const waiting = document.createElement("div");
    waiting.className = "astra-msg from-astra";
    waiting.textContent = "Checking local AI bridges...";
    messages.appendChild(waiting);
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
    const bridgeAnswer = await askBridge(question);
    waiting.remove();
    if (bridgeAnswer) {
      addMessage("astra", bridgeAnswer.source + ": " + bridgeAnswer.answer);
    } else {
      addMessage("astra", localBrain(question));
    }
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

const DASHBOARD_THEME_SCRIPT = `
(function () {
  const button = document.querySelector("[data-dashboard-theme-toggle]");
  const key = "dashboard.theme";
  function getTheme() {
    return document.documentElement.dataset.dashboardTheme || "light";
  }
  function updateButton() {
    if (!button) return;
    const isDark = getTheme() === "midnight";
    button.textContent = isDark ? "☀" : "☾";
    button.setAttribute("aria-label", isDark ? "Switch to light dashboard theme" : "Switch to dark dashboard theme");
    button.title = isDark ? "Light theme" : "Dark theme";
  }
  function setTheme(theme) {
    const safeTheme = theme === "midnight" ? "midnight" : "light";
    document.documentElement.dataset.dashboardTheme = safeTheme;
    try { localStorage.setItem(key, safeTheme); } catch {}
    updateButton();
  }
  try {
    const savedTheme = localStorage.getItem(key);
    if (savedTheme) document.documentElement.dataset.dashboardTheme = savedTheme;
  } catch {}
  updateButton();
  button?.addEventListener("click", () => setTheme(getTheme() === "midnight" ? "light" : "midnight"));
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
    <div class="dash-actions">
      <button class="dash-theme-toggle" type="button" data-dashboard-theme-toggle aria-label="Switch to dark dashboard theme" title="Switch theme">☾</button>
      <nav class="dash-nav">
        ${navHtml}
        <a href="/api/logout">Log out</a>
      </nav>
    </div>
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
      <div><strong>Astra</strong><span>Private learning partner + local AI bridge runner</span></div>
      <button class="astra-close" id="astra-close" type="button" aria-label="Close Astra">&times;</button>
    </div>
    <div class="astra-status" aria-label="Astra capabilities">
      <span>Dashboard actions</span>
      <span>Local AI bridges</span>
      <span>Privacy guard</span>
    </div>
    <div class="astra-messages" id="astra-messages">
      <div class="astra-msg from-astra">I am Astra. I live only inside your private dashboard. I can plan, explain, navigate, draft safe follow-ups, change this dashboard theme, and use local AI tools when a bridge is running.</div>
    </div>
    <div class="astra-actions">
      <button type="button" data-astra-prompt="Make me a small study plan for tonight">Tonight plan</button>
      <button type="button" data-astra-prompt="Explain this dashboard page and what I should do first">Explain page</button>
      <button type="button" data-astra-prompt="Check if the local OpenCode bridge is connected">OpenCode check</button>
      <button type="button" data-astra-prompt="Make dashboard dark and glowing">Dark mode</button>
      <button type="button" data-astra-prompt="Open my course targets">Course</button>
    </div>
    <form class="astra-form" id="astra-form">
      <input id="astra-input" type="text" placeholder="Ask Astra..." autocomplete="off" />
      <button type="submit">Ask</button>
    </form>
  </section>
<script>${extraScript}${DASHBOARD_THEME_SCRIPT}${ASTRA_SCRIPT}</script>
</body>
</html>`;
}

module.exports = { renderShell };
