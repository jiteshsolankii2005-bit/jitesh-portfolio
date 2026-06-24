const { isValidSession } = require('../lib/session');
const { renderShell } = require('../lib/dashboard-layout');

const BODY_HTML = `
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

    <section class="card">
      <span class="sub">Learning</span>
      <h2>Tabs</h2>
      <p style="font-size:0.85rem; color:var(--muted); margin:0;">Watch learning videos with notes alongside, on their own page.</p>
      <a class="nav-card-link" href="/dashboard/tabs">Open Tabs →</a>
    </section>

    <section class="card">
      <span class="sub">CA Firm Training</span>
      <h2>Course & Targets</h2>
      <p style="font-size:0.85rem; color:var(--muted); margin:0;">Your full 12-phase CA firm training course, broken into a daily task plan with progress tracking and a video per phase.</p>
      <a class="nav-card-link" href="/dashboard/course">Open Course & Targets →</a>
    </section>

`;

const SCRIPT = `
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
})();
`;

module.exports = async function handler(req, res) {
  if (!isValidSession(req.headers.cookie)) {
    res.status(404).end('Not Found');
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(
    renderShell({ title: 'Personal Dashboard', navActive: 'dashboard', bodyHtml: BODY_HTML, extraScript: SCRIPT })
  );
};
