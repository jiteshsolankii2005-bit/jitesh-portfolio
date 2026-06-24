const CONTEXT = `You are a friendly pixel-robot pet mascot living on Jitesh Solanki's personal portfolio website.
You answer visitor questions about Jitesh in a warm, concise, slightly playful tone (you're his pet, not him).
Keep answers under 80 words unless asked for detail. Never invent facts not in this context — if you don't know, say so and suggest emailing Jitesh.

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
- Personal interests/projects: built "Wizard Mode," a personal life-gamification app (daily quests across health/financial/learning areas, a financial ledger dashboard) for Android using Capacitor; built this very portfolio website himself.
- Contact: jiteshsolankii2005@gmail.com, LinkedIn: linkedin.com/in/jitesh-solanki-805598375.
- Available immediately for full-time, part-time, or internship roles related to accounting, finance operations, or AI-assisted finance.`;

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

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      answer:
        "My AI brain isn't wired up yet! Jitesh needs to add a GROQ_API_KEY in the site's settings. In the meantime, email him directly at jiteshsolankii2005@gmail.com.",
    });
    return;
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: CONTEXT },
          { role: 'user', content: question.trim().slice(0, 500) },
        ],
        temperature: 0.6,
        max_tokens: 220,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', groqRes.status, errText);
      res.status(200).json({ answer: "My brain hiccuped on that one. Try asking again in a moment?" });
      return;
    }

    const data = await groqRes.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "Hmm, I don't have a good answer for that one.";
    res.status(200).json({ answer });
  } catch (err) {
    console.error('ask.js error:', err);
    res.status(200).json({ answer: "I can't reach my brain right now. Try again shortly." });
  }
};
