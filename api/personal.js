const { isDashboardAuthorized } = require('../lib/session');
const { renderShell } = require('../lib/dashboard-layout');

const BODY_HTML = `
    <section class="card">
      <span class="sub">Site Traffic</span>
      <h2>Analytics</h2>
      <p style="font-size:0.85rem; color:var(--muted); margin:0;">Live visitor counts, top pages, and referrers are tracked by Vercel Web Analytics.</p>
      <a class="analytics-link" href="https://vercel.com/jitesh-solanki/jitesh-co/analytics" target="_blank" rel="noreferrer">View Live Analytics →</a>
    </section>

    <section class="card">
      <span class="sub">US CMA</span>
      <h2>Study Progress</h2>
      <div id="cma-list"></div>
      <div class="progress-bar"><span id="cma-progress-bar" style="width:0%"></span></div>
      <span class="pct-label" id="cma-progress-label">0% complete</span>
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

})();
`;

module.exports = async function handler(req, res) {
  if (!isDashboardAuthorized(req)) {
    res.status(404).end('Not Found');
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(
    renderShell({ title: 'Personal Dashboard', navActive: 'dashboard', bodyHtml: BODY_HTML, extraScript: SCRIPT })
  );
};
