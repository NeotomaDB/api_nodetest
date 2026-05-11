'use strict';
// Session auth middleware for Neotoma API.
//
// Reads "Authorization: Bearer <sessionuuid>" from incoming requests,
// looks the UUID up in ap.orcidlogins, checks that it hasn't expired,
// and attaches the user info to req.user. Downstream route handlers can
// then check req.user to know whether (and as whom) the caller is logged in.
//
// Two flavors:
//   optionalAuth — always continues; req.user is null if no/invalid token
//   requireAuth  — returns 401 if no/invalid/expired token

/**
 * Pull the bearer token out of the Authorization header.
 * Returns the token string, or null if no header / wrong scheme.
 */
function extractBearerToken(req) {
  const header = req.get('Authorization');
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * Look up a session UUID in ap.orcidlogins. Returns the user record
 * if the session exists and hasn't expired, otherwise null.
 */
async function lookupSession(db, sessionuuid) {
  // Basic UUID shape check before hitting the DB. This keeps malformed
  // tokens from causing a SQL error.
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(sessionuuid)) return null;

  const row = await db.oneOrNone(
    `SELECT orcidid, sessionuuid, expiresat, userip
       FROM ap.orcidlogins
      WHERE sessionuuid = $1
        AND expiresat > now()`,
    [sessionuuid]
  );
  return row || null;
}

/**
 * Middleware: attaches req.user if a valid session is present, else null.
 * Always calls next(). Use this on routes that work for both logged-in
 * and anonymous users (e.g., a dataset page that hides embargoed rows).
 */
const optionalAuth = async function(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const db = req.app.locals.db;
    const session = await lookupSession(db, token);
    req.user = session;  // null if not found / expired
    next();
  } catch (err) {
    console.error('optionalAuth lookup failed:', err);
    req.user = null;
    next();
  }
};

/**
 * Middleware: rejects with 401 if no valid session. Use on endpoints
 * that require login (e.g., upload, set embargo, view "my datasets").
 */
const requireAuth = async function(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'Missing Authorization header',
    });
  }
  try {
    const db = req.app.locals.db;
    const session = await lookupSession(db, token);
    if (!session) {
      return res.status(401).json({
        status: 'unauthorized',
        message: 'Invalid or expired session token',
      });
    }
    req.user = session;
    next();
  } catch (err) {
    console.error('requireAuth lookup failed:', err);
    res.status(500).json({
      status: 'error',
      message: 'Auth check failed',
    });
  }
};

module.exports = {optionalAuth, requireAuth};