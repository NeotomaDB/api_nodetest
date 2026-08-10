-- Is the person behind this ORCID a Neotoma steward?
-- Used to gate login: only stewards get a session in ap.orcidlogins.
-- extdatabaseid 7 is ORCID, and identifier is stored in its full URI form
-- (https://orcid.org/0000-...), so the value passed in has to match exactly.
SELECT s.stewardid
FROM ndb.externalcontacts AS ec
INNER JOIN ndb.contacts AS c ON c.contactid = ec.contactid
INNER JOIN ti.stewards AS s ON s.contactid = c.contactid
WHERE ec.extdatabaseid = 7
  AND ec.identifier = ${orcidid}
LIMIT 1;
