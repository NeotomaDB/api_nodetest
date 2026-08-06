INSERT INTO ap.orcidlogins (orcidid, userip, sessionuuid, expiresat, orcidname)
VALUES (${orcidid}, ${ipaddr}, gen_random_uuid(), now() + interval '7 days', ${orcidname})
RETURNING sessionuuid, expiresat;