-- The live session for an ORCID iD, if there is one. "Live" is expiresat > now():
-- logout sets expiresat = now() as well, so that one condition covers expired,
-- logged-out and rotated-out sessions. LIMIT 1 + ORDER BY keeps this from
-- throwing if an older bug (or a bad restore) left duplicate live rows behind:
-- the one that lasts longest wins.
-- `reusable` is computed here, in the database's clock, so there is no skew
-- between the API host and Postgres: sessions with under 24h left are not handed
-- back, otherwise the user would be logged out in the middle of their work.
SELECT sessionuuid,
       expiresat,
       expiresat > now() + interval '24 hours' AS reusable
FROM ap.orcidlogins
WHERE orcidid = ${orcidid}
  AND expiresat > now()
ORDER BY expiresat DESC, sessionuuid
LIMIT 1;
