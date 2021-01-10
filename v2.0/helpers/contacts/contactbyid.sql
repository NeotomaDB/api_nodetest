SELECT
  cnt.contactid AS contactid,
  cnt.contactname AS fullname,
  cnt.familyname AS lastname,
  cnt.givennames AS firstname,
  cnt.url AS url,
  cnt.email AS email,
  cnt.address AS address
FROM
  ndb.contacts AS cnt
WHERE cnt.contactid IN ($1:csv);
