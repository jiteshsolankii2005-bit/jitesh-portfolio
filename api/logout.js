module.exports = async function handler(req, res) {
  res.setHeader('Set-Cookie', 'session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict');
  res.status(302).setHeader('Location', '/').end();
};
