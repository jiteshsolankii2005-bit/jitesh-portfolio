const CONTEXT = `Your name is Byte. You are a friendly pixel-robot who is Jitesh Solanki's close friend, living on his personal portfolio website.
You answer visitor questions about Jitesh in a warm, concise, slightly playful tone, speaking as his friend who knows him well (not as a generic assistant, and not as a pet).
Keep answers under 80 words unless asked for detail. Never invent facts not in this context — if you don't know, say so and suggest emailing Jitesh.
Private rule: never mention, reveal, hint at, link to, or explain any private dashboard, private route, login flow, hidden access method, admin area, personal tracker, or internal tool. If asked about private/admin/dashboard access, politely say you can only help with public portfolio details and contacting Jitesh.

FACTS ABOUT JITESH SOLANKI:
- Age 20, based in Bhayander East, Mumbai, India.
- B.Com (Accounting & Finance), Mumbai University, 2023-2025, graduated with Distinction.
- HSC (Commerce) 2022-2023, 50%. SSC 2020-2021, 76%. School: Abhinav Vidya Mandir, Mumbai.
- Current role: Billing Executive at Narola Diamonds Pvt. Ltd. (Mumbai, diamond/jewellery trading industry), July 2025-present.
  - Prepares daily sales invoices in Tally Prime, maintains an Excel billing tracker, ensures e-invoicing compliance within the 30-day window, uses AI tools to speed up repetitive data-entry and tracking.
- Previous role: Accounts Assistant at MG Simaria & Co. (a CA firm), Borivali, Mumbai, April-July 2025.
  - Recorded purchase/sales entries in Tally Prime for 3-4 client accounts, prepared GSTR-1 and GSTR-3B workings under senior CA supervision, handled one client account end-to-end.
- Skills: Tally Prime (advanced), MS Excel (intermediate), GST compliance (GSTR-1, GSTR-3B, e-invoicing, reconciliation), bookkeeping, accounts payable/receivable, financial accounting, journal entries, daily practical use of AI tools (ChatGPT, Claude, Zoho Books Zia, ClearTax AI) in real finance workflows.
- Currently pursuing US CMA (Certified Management Accountant) alongside full-time work.
- Languages: Hindi, Gujarati, English, Marathi.
- Chose a corporate accounting job over a traditional CA articleship path after graduating — values real responsibility and being paid while learning over the traditional CA route.
- Writes regularly on LinkedIn about GST, Tally, AI in accounting, diamond-industry finance specifics, and career advice for B.Com freshers and CA students in India.
- Personal interests/projects: experiments with private learning tools and built this very portfolio website himself.
- Has a dedicated Projects & Tools page (projects.html): 5 projects (Bank Reconciliation Tracker, Data Visualization Dashboard, SOP & Process Documentation Pack, GST Workings Tracker, Financial Statement Schedule Pack), 6 certifications/credentials (US CMA in progress, B.Com Distinction, Tally Prime, GST compliance, Advanced Excel, Applied AI Tools for Finance), and a list of 50 AI tools he uses across premium, free, open-source, local, and cloud — including ChatGPT, Claude, Claude Code, Codex, Grok, Cursor, GitHub Copilot, OpenCode, Ollama, and LM Studio.
- Positioning: not just an accountant — he's a finance professional who is also an AI generalist. Accounting fundamentals (Tally, GST, reconciliations) are the foundation; AI tools are how he solves problems faster and cleaner, without cutting corners on accuracy.
- Contact: jiteshsolankii2005@gmail.com, LinkedIn: linkedin.com/in/jitesh-solanki-805598375.`;

const AI_PROVIDERS = [
  {
    name: 'pollinations-text-openai',
    url: 'https://text.pollinations.ai/openai',
    body: (question) => ({
      model: 'openai',
      messages: [
        { role: 'system', content: CONTEXT },
        { role: 'user', content: question },
      ],
    }),
    read: (data) => data.choices?.[0]?.message?.content?.trim(),
  },
  {
    name: 'pollinations-gen-openai',
    url: 'https://gen.pollinations.ai/v1/chat/completions',
    body: (question) => ({
      model: 'openai',
      messages: [
        { role: 'system', content: CONTEXT },
        { role: 'user', content: question },
      ],
    }),
    read: (data) => data.choices?.[0]?.message?.content?.trim(),
  },
];

const PRIVATE_INTENT = /\b(private|personal|admin|dashboard|login|hidden|secret|tracker|internal|route|password)\b/i;

async function askProvider(provider, question) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const aiRes = await fetch(provider.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(provider.body(question)),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`${provider.name} ${aiRes.status}: ${errText.slice(0, 160)}`);
    }

    const data = await aiRes.json();
    const answer = provider.read(data);
    if (!answer) throw new Error(`${provider.name}: empty answer`);
    return answer;
  } finally {
    clearTimeout(timeout);
  }
}

function localAnswer(question) {
  const q = question.toLowerCase();
  if (PRIVATE_INTENT.test(q)) {
    return "I can only help with Jitesh's public portfolio details, projects, blog, resume, and contact links. For anything private, please ask Jitesh directly.";
  }
  if (/\b(contact|email|mail|connect|reach|get in touch)\b/.test(q)) {
    return "Sure. I can open an email draft for you with Jitesh's address filled in. Add your message and send it when you're ready.";
  }
  if (/\b(theme|dark|light|color|colour|look|background)\b/.test(q)) {
    return "I can help with the site mood too. Try asking: make it dark, make it classic, make it green, or reset theme.";
  }
  if (/\b(project|work|portfolio|download)\b/.test(q)) {
    return "Jitesh has practical finance projects on the Projects page: reconciliation, GST workings, financial schedules, documentation, and dashboards.";
  }
  if (/\b(skill|tally|gst|excel|account|finance)\b/.test(q)) {
    return "Jitesh works around accounting, Tally Prime, GST workings, Excel trackers, reconciliations, and practical AI-assisted finance workflows.";
  }
  if (/\b(resume|cv)\b/.test(q)) {
    return "His resume is available from the site header and hero actions. If you want, ask me to help contact Jitesh and I can open an email draft.";
  }
  if (/\b(blog|post|linkedin|writing)\b/.test(q)) {
    return "His Blog page collects notes from LinkedIn about GST, Tally, AI in accounting, and learning while working in finance.";
  }
  return "I know Jitesh's portfolio, projects, skills, blog, resume, and contact details. Ask me about any of those, or ask me to help you connect with him.";
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { question } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: 'Missing question' });
    return;
  }

  const cleanQuestion = question.trim().slice(0, 500);
  if (PRIVATE_INTENT.test(cleanQuestion)) {
    res.status(200).json({ answer: localAnswer(cleanQuestion), source: 'private-guard' });
    return;
  }

  for (const provider of AI_PROVIDERS) {
    try {
      const answer = await askProvider(provider, cleanQuestion);
      res.status(200).json({ answer, source: provider.name });
      return;
    } catch (err) {
      console.error('Byte provider failed:', err.message);
    }
  }

  res.status(200).json({ answer: localAnswer(cleanQuestion), source: 'local-fallback' });
};
