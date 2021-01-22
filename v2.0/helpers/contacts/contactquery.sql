WITH tightnames AS (
	SELECT ct.contactid,
	       CONCAT(ct.contactname, ' ', ct.familyname, ' ',
				  ct.givennames, ' ', ct.leadinginitials) AS fullnames
	FROM ndb.contacts AS ct
    GROUP BY ct.contactid)
SELECT
  cnt.*,
	cst.contactstatus
FROM
  ndb.contacts AS cnt
  INNER JOIN ndb.contactstatuses AS cst ON cnt.contactstatusid = cst.contactstatusid
  INNER JOIN tightnames AS tn ON tn.contactid = cnt.contactid
WHERE
  (${familyname} IS NULL OR LOWER(cnt.familyname) LIKE LOWER(${familyname}))
  AND (${contactname} IS NULL OR LOWER(cnt.contactname) LIKE LOWER(${contactname}))
  AND (${contactstatus} IS NULL OR LOWER(cst.contactstatus) LIKE LOWER(${contactstatus}))
  AND (${name} IS NULL OR SIMILARITY(fullnames,${name}) > (CASE WHEN ${similarity} IS NULL THEN 0.5 ELSE ${similarity} END))
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
