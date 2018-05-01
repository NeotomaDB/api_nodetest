SELECT
  cnt.contactid AS contactid,
  cnt.contactname AS fullName,
  cnt.familyname AS lastName, 
  cnt.givennames AS firstName,
  cst.contactstatus AS contactStatus,
  cnt.url AS url,
  cnt.address AS address,
  cnt.recdatecreated AS created,
  cnt.recdatemodified AS modified
FROM
  ndb.contacts AS cnt INNER JOIN
  ndb.contactstatuses AS cst ON cnt.contactstatusid = cst.contactstatusid
WHERE
  (${lastname} IS NULL OR cnt.familyname LIKE ${lastname})
  AND (${contactname} IS NULL OR cnt.contactname LIKE ${contactname})
  AND (${status} IS NULL OR LOWER(cst.contactstatus) LIKE LOWER(${status}))
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
