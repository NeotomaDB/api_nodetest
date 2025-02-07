SELECT ct.*
FROM ndb.externalcontacts AS exct
INNER JOIN ndb.contacts AS ct ON exct.contactid = ct.contactid
WHERE
extdatabaseid = 7
AND exct.identifier = ${orcid};