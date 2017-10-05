SELECT cnt.contactid AS contactid
FROM
ndb.contacts AS cnt
WHERE
cnt.contactid IN ($1:csv);