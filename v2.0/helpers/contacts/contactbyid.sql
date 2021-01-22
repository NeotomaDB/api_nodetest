SELECT
  cnt.*,
  cst.contactstatus
FROM
  ndb.contacts AS cnt
  INNER JOIN ndb.contactstatuses AS cst ON cnt.contactstatusid = cst.contactstatusid
WHERE cnt.contactid IN ($1:csv);
