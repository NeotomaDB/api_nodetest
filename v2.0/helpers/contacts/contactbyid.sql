SELECT 
  cnt.contactid AS contactid,
  cnt.contactname AS fullName,
  cnt.familyname AS lastName, 
  cnt.givennames AS firstName,
  cnt.url AS url,
  cnt.address AS address
FROM
  ndb.contacts AS cnt 
WHERE cnt.contactid IN ($1:csv);