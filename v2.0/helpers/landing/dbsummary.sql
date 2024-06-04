WITH constdb AS (
  select
    cdb.databaseid,
    cdb.databasename,
    cdb.description,
    cdb.url,
    cnt.contactname,
    cnt.email,
    COUNT(distinct qt.siteid)::int AS sites
  from ndb.constituentdatabases AS cdb
  left join ap.querytable as qt on cdb.databaseid = qt.databaseid
  left join ndb.contacts as cnt on cdb.contactid = cnt.contactid
  WHERE (cdb.databaseid IS NULL OR cdb.databaseid = ${dbid})
  group by
      cdb.databasename, 
      cdb.databaseid,
      cdb.description,
      cdb.url,
      cnt.contactname,
	  cnt.email
), datasets as (
	select
		qt.databaseid,
		jsonb_build_object('datasettype', qt.datasettype,
		  	'datasets', COUNT(distinct qt.datasetid)) as datasettypes
	from ap.querytable as qt
	where (qt.databaseid IS NULL OR qt.databaseid = ${dbid})
	group by
		qt.databaseid,
		qt.datasettype
)
select
  db.databaseid,
  db.databasename,
  db.url,
  db.contactname,
  db.email,
  db.sites,
  array_agg(dst.datasettypes) as datasettypes
  from constdb as db
  left join datasets as dst on dst.databaseid = db.databaseid
  group by 
	  db.databaseid,
	  db.databasename,
	  db.url,
	  db.contactname,
	  db.email,
    db.sites;