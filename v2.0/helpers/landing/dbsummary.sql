select cdb.databasename,
  cdb.description,
  cdb.url,
  cnt.contactname,
  cnt.email,
  array_agg(distinct qt.datasettype) AS datasettypes,
  MIN(qt.younger) as younger,
  MAX(qt.older) as older,
  COUNT(distinct qt.datasetid) AS datasets
from ndb.constituentdatabases AS cdb
left join ap.querytable as qt on cdb.databaseid = qt.databaseid
left join ndb.contacts as cnt on cdb.contactid = cnt.contactid
group by
    cdb.databasename, 
    cdb.description,
    cnt.contactname,
    cdb.url,
    cnt.email;