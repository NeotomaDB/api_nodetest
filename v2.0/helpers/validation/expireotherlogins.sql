-- Expire every live session for an ORCID iD except `keep`. Pass keep = NULL to
-- expire all of them (used just before minting a replacement).
-- Only expiresat is set. loggedoutat is left alone on purpose: it means "the user
-- clicked Logout", so a NULL there on an expired row marks one the API retired.
UPDATE ap.orcidlogins
SET expiresat = now()
WHERE orcidid = ${orcidid}
  AND expiresat > now()
  AND sessionuuid IS DISTINCT FROM ${keep}::uuid;
