SELECT
  cnt.contactid AS contactid,
  cnt.contactname AS contactname,
  cnt.familyname AS familyname,
  cnt.givennames AS givennames,
  cst.contactstatus AS contactstatus,
  cnt.url AS url,
  cnt.email AS email,
  cnt.address AS address
FROM
  ndb.contacts AS cnt INNER JOIN
  ndb.contactstatuses AS cst ON cnt.contactstatusid = cst.contactstatusid
WHERE
  (${contactid} IS NULL OR cnt.contactid = ANY (${contactid}))
  AND (${familyname} IS NULL OR LOWER(cnt.familyname) LIKE LOWER(${familyname}))
  AND (${contactname} IS NULL OR LOWER(cnt.contactname) LIKE LOWER(${contactname}))
  AND (${contactstatus} IS NULL OR LOWER(cst.contactstatus) LIKE LOWER(${contactstatus}))
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
