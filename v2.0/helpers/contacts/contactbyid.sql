SELECT
  cnt.contactid,
  stw.stewardid,
  cnt.contactname,
  cnt.familyname,
  cnt.leadinginitials,
  cnt.givennames,
  cnt.suffix,
  cnt.title,
  cnt.phone,
  cnt.fax,
  cnt.email,
  cnt.url,
  cnt.address,
  cnt.notes,
  cst.contactstatus
FROM
  ndb.contacts AS cnt
  INNER JOIN ndb.contactstatuses AS cst ON cnt.contactstatusid = cst.contactstatusid
  LEFT JOIN ti.stewards AS stw ON stw.contactid = cnt.contactid
WHERE cnt.contactid IN ($1:csv);
