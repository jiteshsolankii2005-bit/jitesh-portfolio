const crypto = require('crypto');

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const TRUSTED_DEVICE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function sign(payload) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('hex');
}

function makeToken() {
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

function makeTrustedDeviceToken(userAgent = '') {
  const expires = Date.now() + TRUSTED_DEVICE_MAX_AGE * 1000;
  const uaHash = crypto.createHash('sha256').update(String(userAgent)).digest('hex').slice(0, 24);
  const payload = `${expires}.${uaHash}`;
  return `${payload}.${sign(payload)}`;
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  });
  return out;
}

function isValidSession(cookieHeader) {
  const token = parseCookies(cookieHeader).session;
  if (!token) return false;
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!timingSafeEqual(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

function isTrustedDevice(cookieHeader, userAgent = '') {
  const token = parseCookies(cookieHeader).trusted_device;
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const signature = parts[2];
  if (!timingSafeEqual(signature, sign(payload))) return false;
  const expires = Number(parts[0]);
  if (!Number.isFinite(expires) || expires <= Date.now()) return false;
  const uaHash = crypto.createHash('sha256').update(String(userAgent)).digest('hex').slice(0, 24);
  return timingSafeEqual(parts[1], uaHash);
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return String(firstForwarded || req.headers['x-real-ip'] || req.socket?.remoteAddress || '')
    .split(',')[0]
    .trim();
}

function isAllowedIp(req) {
  const allowed = String(process.env.PERSONAL_ALLOWED_IPS || '').trim();
  if (!allowed) return true;
  const ip = getClientIp(req);
  return allowed
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .includes(ip);
}

function isDashboardAuthorized(req) {
  const userAgent = req.headers['user-agent'] || '';
  return isAllowedIp(req) && isValidSession(req.headers.cookie) && isTrustedDevice(req.headers.cookie, userAgent);
}

module.exports = {
  SESSION_MAX_AGE,
  TRUSTED_DEVICE_MAX_AGE,
  makeToken,
  makeTrustedDeviceToken,
  timingSafeEqual,
  isValidSession,
  isTrustedDevice,
  isAllowedIp,
  isDashboardAuthorized,
};
