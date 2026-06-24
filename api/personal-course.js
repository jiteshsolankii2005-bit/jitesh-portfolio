const { isDashboardAuthorized } = require('../lib/session');
const { renderShell } = require('../lib/dashboard-layout');

// Course structure synthesized from the user's own CA_Training_Complete.pdf
// (12-phase personal CA firm training course). Tasks below are original
// task breakdowns written for this tracker, not reproduced from the source.
const PHASES = [
  {
    days: 'Day 1–2',
    title: 'Phase 1 — Accounting Foundations',
    video: 'B0ZrxQk-g38',
    tasks: [
      'Accounting equation: Assets = Liabilities + Equity',
      'Debit & credit rules by account type',
      'Three golden rules of accounting',
      'Recording journal entries with proper narrations',
      'Posting entries to ledger (T-accounts)',
      'Preparing a trial balance',
      'Capital vs revenue expenditure',
      'Rectifying common entry errors',
    ],
  },
  {
    days: 'Day 3–4',
    title: 'Phase 2 — Tally Prime',
    video: 'h9croue2uRo',
    tasks: [
      'Company setup, security & GST configuration',
      'Creating masters: ledgers, stock items, groups',
      'Recording vouchers: payment, receipt, contra, journal',
      'Practical day-to-day entries in Tally',
    ],
  },
  {
    days: 'Day 5–8',
    title: 'Phase 3 — GST Practical',
    video: 'xVZd5US-cl0',
    tasks: [
      'CGST / SGST / IGST mechanics',
      'Input Tax Credit (ITC): eligibility & conditions',
      'Output tax calculation',
      'Reverse Charge Mechanism (RCM)',
      'Composition scheme basics',
      'Recording GST purchase entries',
      'Recording GST sales entries',
      'Building purchase & sales registers',
      'GST reconciliation between books and GSTR data',
      'GSTR-1 / GSTR-3B filing workflow',
    ],
  },
  {
    days: 'Day 9–13',
    title: 'Phase 4 — Bank Reconciliation',
    video: '_1Fdxk-24qo',
    tasks: [
      'Building a BRS from bank statement vs. cash book',
      'Identifying unpresented cheques & uncredited deposits',
      'Adjusting for bank charges & interest credited',
      'Reconciling NEFT / RTGS / IMPS / UPI timing differences',
      'Full multi-account BRS case practice',
    ],
  },
  {
    days: 'Day 14–16',
    title: 'Phase 5 — Purchase & Sales Department',
    video: 'k4ZNC8ltJA0',
    tasks: [
      'Purchase order → GRN → purchase entry → payment cycle',
      'Quotation → sales order → tax invoice → receipt cycle',
      'Mandatory tax invoice fields: HSN/SAC, taxable value, place of supply',
      'Outstanding recovery & ledger matching',
      'Full purchase & sales cycle simulation',
    ],
  },
  {
    days: 'Day 17–20',
    title: 'Phase 6 — E-Invoicing & E-Way Bill',
    video: 'df0UpDHuSQ8',
    tasks: [
      'E-invoice concept, IRN & QR code',
      'Generating, cancelling & amending e-invoices',
      'E-way bill generation & exemptions',
      'E-way bill cancellation & amendment',
      'Matching e-invoice + e-way bill to dispatch documents',
    ],
  },
  {
    days: 'Day 21–23',
    title: 'Phase 7 — Excel for Accountants',
    video: 'kseBA178jNc',
    tasks: [
      'SUM / SUMIF / SUMIFS for conditional totals',
      'XLOOKUP / VLOOKUP / INDEX-MATCH for data lookups',
      'FILTER, SORT, UNIQUE dynamic array formulas',
      'Pivot tables for summarized reporting',
      'Power Query for importing & cleaning bank/GST data',
      'Conditional formatting & data validation',
      'Building practical working papers (BRS, GST workings, cash book)',
    ],
  },
  {
    days: 'Day 24–27',
    title: 'Phase 8 — TDS (Tax Deducted at Source)',
    video: '6qXnR428T8c',
    tasks: [
      'TDS sections overview (194C, 194J, 194Q, etc.)',
      'Deducting TDS at the correct trigger point',
      'Depositing TDS via challan',
      'Filing TDS returns (24Q / 26Q) with correct PAN matching',
      'Lower / Nil TDS certificates',
      'TDS interest & late-filing penalties',
    ],
  },
  {
    days: 'Day 28–30',
    title: 'Phase 9 — Payroll',
    video: 'NJfPOuEkMIA',
    tasks: [
      'Building CTC & salary structure (Basic, HRA, allowances)',
      'PF computation & administration',
      'ESIC computation & benefits',
      'Professional tax, leave types, bonus & gratuity',
      'Processing payroll in Tally & payroll journal entries',
      'Preparing a sample salary slip end to end',
    ],
  },
  {
    days: 'Day 31–33',
    title: 'Phase 10 — Finalization Basics',
    video: 'LYcgAUKTmYc',
    tasks: [
      'Adjusting for depreciation, provisions, accruals & prepayments',
      'Verifying closing stock',
      'Trial Balance → Trading A/c → P&L → Balance Sheet',
      'Following a finalization checklist before sign-off',
      'Passing adjusting entries & preparing working papers',
    ],
  },
  {
    days: 'Day 34–37',
    title: 'Phase 11 — CA Firm Daily Work',
    video: 'DUPsy3Wfl1A',
    tasks: [
      'Document collection & invoice verification',
      'Daily accounting entries across multiple clients',
      'GST verification & bank reconciliation as a daily habit',
      'TDS checking & responding to client queries',
      'Excel working papers & final review before reporting to senior',
      'Following the daily task checklist end-to-end',
    ],
  },
  {
    days: 'Day 38–41',
    title: 'Phase 12 — Real Client Simulation',
    video: 'ZPmVf89aesw',
    tasks: [
      'Run a full client file start to finish: documents → entries → GST/TDS → BRS → finalization',
      'Write journal entries with correct narrations',
      'Note the relevant section/rule applied for each treatment',
      'Prepare working notes for every adjustment',
      'Self-review against the Phase 11 daily checklist before submission',
    ],
  },
];

const EXTRA_STYLE = `
  .course-overview { grid-column: 1 / -1; }
  .phase-card { grid-column: 1 / -1; }
  .phase-head { display:flex; align-items:baseline; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .phase-days { font-family:"IBM Plex Mono",monospace; font-size:0.72rem; color: var(--muted); text-transform:uppercase; letter-spacing:0.04em; }
  .phase-body { display:grid; grid-template-columns: 1fr 1.3fr; gap:20px; margin-top:14px; }
  .phase-tasks label.quest { align-items:flex-start; }
  .phase-tasks input[type="checkbox"] { margin-top:3px; }
  .phase-video { position:relative; padding-top:56.25%; background:#000; border-radius:var(--radius); overflow:hidden; height:0; }
  .phase-video iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
  @media (max-width: 760px) { .phase-body { grid-template-columns: 1fr; } }
`;

function phaseCardHtml(phase, index) {
  const taskItems = phase.tasks
    .map(
      (task, taskIndex) => `
        <label class="quest">
          <input type="checkbox" data-phase="${index}" data-task="${taskIndex}" />
          <span>${task}</span>
        </label>`
    )
    .join('');

  return `
    <section class="card phase-card">
      <div class="phase-head">
        <div>
          <span class="phase-days">${phase.days}</span>
          <h2>${phase.title}</h2>
        </div>
      </div>
      <div class="phase-body">
        <div class="phase-tasks">
          ${taskItems}
          <div class="progress-bar"><span id="phase-bar-${index}" style="width:0%"></span></div>
          <span class="pct-label" id="phase-label-${index}">0% complete</span>
        </div>
        <div class="phase-video">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${phase.video}"
            title="${phase.title}"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>`;
}

const BODY_HTML = `
    <section class="card course-overview">
      <span class="sub">CA Firm Training</span>
      <h2>Course & Targets</h2>
      <p style="font-size:0.85rem; color:var(--muted); margin:0 0 10px;">
        Your full CA firm assistant accountant training, broken into 12 phases across roughly 41 working days.
        Check off each task as you complete it — progress is saved automatically.
      </p>
      <div class="progress-bar"><span id="course-bar" style="width:0%"></span></div>
      <span class="pct-label" id="course-label">0% of course complete</span>
    </section>
${PHASES.map(phaseCardHtml).join('\n')}
`;

const SCRIPT = `
(function () {
  const PHASE_TASK_COUNTS = ${JSON.stringify(PHASES.map((p) => p.tasks.length))};
  const courseKey = "personal.course";
  const state = JSON.parse(localStorage.getItem(courseKey) || "{}");

  document.querySelectorAll('.phase-tasks input[type="checkbox"]').forEach((input) => {
    const phase = input.dataset.phase;
    const task = input.dataset.task;
    const id = phase + "::" + task;
    input.checked = !!state[id];
    input.addEventListener("change", () => {
      state[id] = input.checked;
      localStorage.setItem(courseKey, JSON.stringify(state));
      updatePhaseProgress(Number(phase));
      updateCourseProgress();
    });
  });

  function updatePhaseProgress(phaseIndex) {
    const total = PHASE_TASK_COUNTS[phaseIndex];
    let done = 0;
    for (let t = 0; t < total; t++) {
      if (state[phaseIndex + "::" + t]) done++;
    }
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById("phase-bar-" + phaseIndex).style.width = pct + "%";
    document.getElementById("phase-label-" + phaseIndex).textContent = pct + "% complete";
  }

  function updateCourseProgress() {
    let totalTasks = 0;
    let doneTasks = 0;
    PHASE_TASK_COUNTS.forEach((count, phaseIndex) => {
      totalTasks += count;
      for (let t = 0; t < count; t++) {
        if (state[phaseIndex + "::" + t]) doneTasks++;
      }
    });
    const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    document.getElementById("course-bar").style.width = pct + "%";
    document.getElementById("course-label").textContent = pct + "% of course complete (" + doneTasks + "/" + totalTasks + " tasks)";
  }

  PHASE_TASK_COUNTS.forEach((_, phaseIndex) => updatePhaseProgress(phaseIndex));
  updateCourseProgress();
})();
`;

module.exports = async function handler(req, res) {
  if (!isDashboardAuthorized(req)) {
    res.status(404).end('Not Found');
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(
    renderShell({
      title: 'Course & Targets',
      navActive: 'course',
      bodyHtml: BODY_HTML,
      extraStyle: EXTRA_STYLE,
      extraScript: SCRIPT,
    })
  );
};
