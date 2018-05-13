SELECT
  cnt.contactid AS contactid,
  cnt.contactname AS fullName,
  cnt.familyname AS lastName, 
  cnt.givennames AS firstName,
  cst.contactstatus AS contactStatus,
  cnt.url AS url,
  cnt.address AS address
FROM
  ndb.contacts AS cnt INNER JOIN
  ndb.contactstatuses AS cst ON cnt.contactstatusid = cst.contactstatusid
WHERE
  (${lastname} IS NULL OR LOWER(cnt.familyname) LIKE LOWER(${lastname}))
  AND (${contactname} IS NULL OR LOWER(cnt.contactname) LIKE LOWER(${contactname}))
  AND (${status} IS NULL OR LOWER(cst.contactstatus) LIKE LOWER(${status}))
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
