const http = require('http');

const PORT = Number(process.env.ASTRA_BRIDGE_PORT || 8766);
const HOST = '127.0.0.1';

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 100_000) {
        req.destroy();
        reject(new Error('Request too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

async function postJson(url, body, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

function systemPrompt() {
  return [
    "You are Astra, Jitesh Solanki's private dashboard learning partner.",
    'Be practical, concise, privacy-safe, and beginner-friendly for accounting.',
    'Turn vague requests into next actions.',
    'Never reveal passwords, cookies, hidden routes, or private dashboard internals.',
  ].join(' ');
}

async function askOpenCode(question, context) {
  const url = process.env.OPENCODE_AGENT_URL;
  if (!url) return null;
  const data = await postJson(url, { question, context, system: systemPrompt(), source: 'astra-local-bridge' });
  return data?.answer || data?.message || null;
}

async function askOllama(question, context) {
  const data = await postJson(process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/chat', {
    model: process.env.OLLAMA_MODEL || 'llama3.2',
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: `${question}\n\nDashboard context: ${JSON.stringify(context || {})}` },
    ],
  });
  return data?.message?.content || null;
}

async function askLmStudio(question, context) {
  const data = await postJson(process.env.LM_STUDIO_URL || 'http://127.0.0.1:1234/v1/chat/completions', {
    model: process.env.LM_STUDIO_MODEL || 'local-model',
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: `${question}\n\nDashboard context: ${JSON.stringify(context || {})}` },
    ],
  });
  return data?.choices?.[0]?.message?.content || null;
}

async function answer(payload) {
  const question = String(payload.question || '').trim();
  if (!question) return { answer: 'Ask me a clear question and I will help.' };

  const providers = [
    ['OpenCode', () => askOpenCode(question, payload.context)],
    ['Ollama', () => askOllama(question, payload.context)],
    ['LM Studio', () => askLmStudio(question, payload.context)],
  ];

  for (const [name, ask] of providers) {
    try {
      const result = await ask();
      if (result) return { answer: `${name}: ${result}` };
    } catch {}
  }

  return {
    answer:
      'No local AI bridge answered. Start OpenCode bridge, Ollama, or LM Studio on this laptop, then ask Astra again.',
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/ask') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  try {
    const payload = await readJson(req);
    const body = await answer(payload);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ answer: 'Astra bridge error: ' + err.message }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Astra local bridge listening at http://${HOST}:${PORT}/ask`);
});
