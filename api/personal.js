const { isValidSession } = require('../lib/session');

const DASHBOARD_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Personal Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
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
  header { display:flex; align-items:center; justify-content:space-between; padding: 18px 28px; border-bottom: 1px solid var(--line); background: rgba(255,253,249,0.88); backdrop-filter: blur(12px); }
  header h1 { font-family:"Fraunces",serif; font-size:1.3rem; margin:0; }
  header a { font-family:"IBM Plex Mono",monospace; font-size:0.8rem; color: var(--muted); text-decoration:none; }
  header a:hover { color: var(--ink); }
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
  textarea#notes-area { width:100%; min-height:160px; border:1px solid var(--line-strong); border-radius: var(--radius); padding:10px; font-family:inherit; font-size:0.88rem; resize:vertical; }
  .saved-tag { font-family:"IBM Plex Mono",monospace; font-size:0.7rem; color: var(--muted); margin-top:6px; display:block; opacity:0; transition: opacity 300ms ease; }
  .saved-tag.is-visible { opacity:1; }
  .analytics-link { display:inline-block; margin-top:8px; padding:9px 16px; background: var(--ink); color:#fff; border-radius: var(--radius); text-decoration:none; font-size:0.85rem; font-weight:600; }
  .empty-note { color: var(--muted); font-size:0.82rem; font-style:italic; padding:6px 0; }
  .video-layout { display:grid; grid-template-columns: 1.6fr 1fr; gap:16px; margin-top:14px; }
  .video-frame { position:relative; padding-top:56.25%; background:#000; border-radius:var(--radius); overflow:hidden; }
  .video-frame iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
  .video-notes { display:flex; flex-direction:column; }
  .video-notes textarea { width:100%; flex:1; min-height:220px; border:1px solid var(--line-strong); border-radius:var(--radius); padding:10px; font-family:inherit; font-size:0.88rem; resize:vertical; }
  @media (max-width: 760px) { .video-layout { grid-template-columns: 1fr; } }
  @media (prefers-reduced-motion: reduce) {
    .dashboard-wallpaper,
    .dashboard-wallpaper span { animation:none; }
  }
</style>
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
    <h1>Personal Dashboard</h1>
    <a href="/api/logout">Log out</a>
  </header>
  <main>

    <section class="card">
      <span class="sub">Site Traffic</span>
      <h2>Analytics</h2>
      <p style="font-size:0.85rem; color:var(--muted); margin:0;">Live visitor counts, top pages, and referrers are tracked by Vercel Web Analytics.</p>
      <a class="analytics-link" href="https://vercel.com/jitesh-solanki/jitesh-co/analytics" target="_blank" rel="noreferrer">View Live Analytics →</a>
    </section>

    <section class="card">
      <span class="sub">Today</span>
      <h2>Daily Quest Tracker</h2>
      <div id="quest-groups"></div>
      <div class="progress-bar"><span id="quest-progress-bar" style="width:0%"></span></div>
      <span class="pct-label" id="quest-progress-label">0% complete today</span>
    </section>

    <section class="card">
      <span class="sub">Pipeline</span>
      <h2>Job / Opportunity Tracker</h2>
      <div class="row-input">
        <input type="text" id="job-company" placeholder="Company name" />
        <select id="job-status">
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <button id="job-add">Add</button>
      </div>
      <ul class="list-items" id="job-list"></ul>
    </section>

    <section class="card">
      <span class="sub">US CMA</span>
      <h2>Study Progress</h2>
      <div id="cma-list"></div>
      <div class="progress-bar"><span id="cma-progress-bar" style="width:0%"></span></div>
      <span class="pct-label" id="cma-progress-label">0% complete</span>
    </section>

    <section class="card">
      <span class="sub">Quick Entry</span>
      <h2>Finance Ledger Snapshot</h2>
      <div class="row-input">
        <input type="text" id="ledger-desc" placeholder="Description" />
        <input type="number" id="ledger-amount" placeholder="+/- amount" style="max-width:110px;" />
        <button id="ledger-add">Add</button>
      </div>
      <ul class="list-items" id="ledger-list"></ul>
      <div class="ledger-total" id="ledger-total">₹0</div>
    </section>

    <section class="card">
      <span class="sub">Backlog</span>
      <h2>Content Idea Notes</h2>
      <textarea id="notes-area" placeholder="Blog / LinkedIn post ideas, half-formed thoughts, anything..."></textarea>
      <span class="saved-tag" id="notes-saved">Saved</span>
    </section>

    <section class="card" style="grid-column: 1 / -1;">
      <span class="sub">Learning</span>
      <h2>Tabs</h2>
      <div class="video-layout">
        <div class="video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/dFc-BUe506s"
            title="Learning video"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="video-notes">
          <textarea id="video-notes-area" placeholder="Notes while watching..."></textarea>
          <span class="saved-tag" id="video-notes-saved">Saved</span>
        </div>
      </div>
    </section>

  </main>

<script>
(function () {
  const todayKey = () => new Date().toISOString().slice(0, 10);

  // --- Daily Quest Tracker ---
  const QUESTS = {
    Health: ["Drink 2L water", "20 min exercise / walk"],
    Finance: ["Log today's expenses", "Review one ledger entry"],
    Learning: ["30 min CMA study", "Read one AI tool's docs"],
  };
  const questKey = "personal.quests." + todayKey();
  const questState = JSON.parse(localStorage.getItem(questKey) || "{}");
  const questGroups = document.getElementById("quest-groups");
  let questTotal = 0;
  Object.entries(QUESTS).forEach(([group, items]) => {
    const div = document.createElement("div");
    div.className = "quest-group";
    const strong = document.createElement("strong");
    strong.textContent = group;
    div.appendChild(strong);
    items.forEach((item) => {
      questTotal++;
      const id = group + "::" + item;
      const label = document.createElement("label");
      label.className = "quest";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !!questState[id];
      input.addEventListener("change", () => {
        questState[id] = input.checked;
        localStorage.setItem(questKey, JSON.stringify(questState));
        updateQuestProgress();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(item));
      div.appendChild(label);
    });
    questGroups.appendChild(div);
  });
  function updateQuestProgress() {
    const done = Object.values(questState).filter(Boolean).length;
    const pct = questTotal ? Math.round((done / questTotal) * 100) : 0;
    document.getElementById("quest-progress-bar").style.width = pct + "%";
    document.getElementById("quest-progress-label").textContent = pct + "% complete today";
  }
  updateQuestProgress();

  // --- Job Tracker ---
  const jobKey = "personal.jobs";
  let jobs = JSON.parse(localStorage.getItem(jobKey) || "[]");
  const jobList = document.getElementById("job-list");
  function renderJobs() {
    jobList.innerHTML = "";
    if (!jobs.length) {
      jobList.innerHTML = '<li class="empty-note">No entries yet.</li>';
      return;
    }
    jobs.forEach((job, i) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = job.company + " — " + job.status;
      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.addEventListener("click", () => {
        jobs.splice(i, 1);
        localStorage.setItem(jobKey, JSON.stringify(jobs));
        renderJobs();
      });
      li.appendChild(span);
      li.appendChild(btn);
      jobList.appendChild(li);
    });
  }
  document.getElementById("job-add").addEventListener("click", () => {
    const company = document.getElementById("job-company").value.trim();
    if (!company) return;
    const status = document.getElementById("job-status").value;
    jobs.push({ company, status });
    localStorage.setItem(jobKey, JSON.stringify(jobs));
    document.getElementById("job-company").value = "";
    renderJobs();
  });
  renderJobs();

  // --- US CMA Study Progress ---
  const CMA_TOPICS = [
    "Part 1: External Financial Reporting Decisions",
    "Part 1: Planning, Budgeting & Forecasting",
    "Part 1: Performance Management",
    "Part 1: Cost Management",
    "Part 1: Internal Controls",
    "Part 1: Technology & Analytics",
    "Part 2: Financial Statement Analysis",
    "Part 2: Corporate Finance",
    "Part 2: Decision Analysis",
    "Part 2: Risk Management",
    "Part 2: Investment Decisions",
    "Part 2: Professional Ethics",
  ];
  const cmaKey = "personal.cma";
  const cmaState = JSON.parse(localStorage.getItem(cmaKey) || "{}");
  const cmaList = document.getElementById("cma-list");
  CMA_TOPICS.forEach((topic) => {
    const label = document.createElement("label");
    label.className = "quest";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!cmaState[topic];
    input.addEventListener("change", () => {
      cmaState[topic] = input.checked;
      localStorage.setItem(cmaKey, JSON.stringify(cmaState));
      updateCmaProgress();
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(topic));
    cmaList.appendChild(label);
  });
  function updateCmaProgress() {
    const done = Object.values(cmaState).filter(Boolean).length;
    const pct = Math.round((done / CMA_TOPICS.length) * 100);
    document.getElementById("cma-progress-bar").style.width = pct + "%";
    document.getElementById("cma-progress-label").textContent = pct + "% complete";
  }
  updateCmaProgress();

  // --- Finance Ledger Snapshot ---
  const ledgerKey = "personal.ledger";
  let ledger = JSON.parse(localStorage.getItem(ledgerKey) || "[]");
  const ledgerList = document.getElementById("ledger-list");
  function renderLedger() {
    ledgerList.innerHTML = "";
    if (!ledger.length) {
      ledgerList.innerHTML = '<li class="empty-note">No entries yet.</li>';
    } else {
      ledger.forEach((entry, i) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = entry.desc + ": " + (entry.amount >= 0 ? "+" : "") + entry.amount;
        const btn = document.createElement("button");
        btn.textContent = "Remove";
        btn.addEventListener("click", () => {
          ledger.splice(i, 1);
          localStorage.setItem(ledgerKey, JSON.stringify(ledger));
          renderLedger();
        });
        li.appendChild(span);
        li.appendChild(btn);
        ledgerList.appendChild(li);
      });
    }
    const total = ledger.reduce((sum, e) => sum + e.amount, 0);
    document.getElementById("ledger-total").textContent = "₹" + total.toLocaleString("en-IN");
  }
  document.getElementById("ledger-add").addEventListener("click", () => {
    const desc = document.getElementById("ledger-desc").value.trim();
    const amount = parseFloat(document.getElementById("ledger-amount").value);
    if (!desc || Number.isNaN(amount)) return;
    ledger.push({ desc, amount });
    localStorage.setItem(ledgerKey, JSON.stringify(ledger));
    document.getElementById("ledger-desc").value = "";
    document.getElementById("ledger-amount").value = "";
    renderLedger();
  });
  renderLedger();

  // --- Content Idea Notes ---
  const notesKey = "personal.notes";
  const notesArea = document.getElementById("notes-area");
  const notesSaved = document.getElementById("notes-saved");
  notesArea.value = localStorage.getItem(notesKey) || "";
  let notesTimer;
  notesArea.addEventListener("input", () => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      localStorage.setItem(notesKey, notesArea.value);
      notesSaved.classList.add("is-visible");
      setTimeout(() => notesSaved.classList.remove("is-visible"), 1200);
    }, 500);
  });

  // --- Video Notes (Tabs) ---
  const videoNotesKey = "personal.video-notes";
  const videoNotesArea = document.getElementById("video-notes-area");
  const videoNotesSaved = document.getElementById("video-notes-saved");
  videoNotesArea.value = localStorage.getItem(videoNotesKey) || "";
  let videoNotesTimer;
  videoNotesArea.addEventListener("input", () => {
    clearTimeout(videoNotesTimer);
    videoNotesTimer = setTimeout(() => {
      localStorage.setItem(videoNotesKey, videoNotesArea.value);
      videoNotesSaved.classList.add("is-visible");
      setTimeout(() => videoNotesSaved.classList.remove("is-visible"), 1200);
    }, 500);
  });
})();
</script>
</body>
</html>`;

module.exports = async function handler(req, res) {
  if (!isValidSession(req.headers.cookie)) {
    res.status(404).end('Not Found');
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(DASHBOARD_HTML);
};
