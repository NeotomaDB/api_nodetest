SELECT 
  cnt.contactid,
  cnt.contactname,
  cnt.familyname, 
  cnt.givennames,
  cnt.url,
  cnt.address
FROM
  ndb.contacts AS cnt 
WHERE cnt.contactid IN ($1:csv);