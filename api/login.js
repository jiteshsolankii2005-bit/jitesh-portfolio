const { SESSION_MAX_AGE, makeToken, timingSafeEqual } = require('../lib/session');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(404).end('Not Found');
    return;
  }

  const { id, password } = req.body || {};
  const validId = typeof id === 'string' && timingSafeEqual(id, process.env.PERSONAL_LOGIN_ID || '');
  const validPassword = typeof password === 'string' && timingSafeEqual(password, process.env.PERSONAL_LOGIN_PASSWORD || '');

  if (!validId || !validPassword) {
    res.status(401).json({ ok: false });
    return;
  }

  const token = makeToken();
  res.setHeader(
    'Set-Cookie',
    `session=${token}; Max-Age=${SESSION_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Strict`
  );
  res.status(200).json({ ok: true });
};
