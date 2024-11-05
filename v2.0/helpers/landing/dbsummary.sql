WITH constdb AS (
  select
	cdb.databaseid,
    jsonb_build_object( 'databaseid', cdb.databaseid,
     				    'databasename', cdb.databasename,
					    'description', cdb.description,
						'url', cdb.url,
						'contact',cnt.contactname,
						'email', cnt.email) as database,
    qt.siteid,
    qt.datasetid,
    qt.datasettype
  from ndb.constituentdatabases AS cdb
  left join ap.querytable as qt on cdb.databaseid = qt.databaseid
  left join ndb.contacts as cnt on cdb.contactid = cnt.contactid
  WHERE (${dbid} IS NULL OR cdb.databaseid = ${dbid})
), sites as (
	select
		dst.databaseid,	
		dst.database,
	    COUNT(dst.siteid) as sitecount
	from
		constdb as dst
	group by
		dst.database,
		dst.databaseid
), grouped as (
	select
	  st.database,
	  st.sitecount,
	  jsonb_build_object('datasettype', cdb.datasettype, 'datasets', COUNT(*)) as datasettypes
	  from sites as st
	  inner join constdb as cdb on cdb.databaseid = st.databaseid
	  group by cdb.datasettype,
	  st.database,
	  st.sitecount
)
SELECT 
	database,
	sitecount,
	array_agg(datasettypes) AS datasettypes
from grouped
group by
	database,
	sitecount