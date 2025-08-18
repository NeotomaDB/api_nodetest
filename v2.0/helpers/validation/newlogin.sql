INSERT INTO ap.orcidlogins (orcidid, userip, sessionuuid, expiresat)
VALUES (${orcidid}, ${ipaddr}, gen_random_uuid(), now() + interval '5 days')
RETURNING sessionuuid;