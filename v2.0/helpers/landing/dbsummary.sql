WITH constdb AS (
  select
	cdb.databaseid,
    jsonb_build_object( 'databaseid', cdb.databaseid,
     				    'databasename', cdb.databasename,
					    'description', cdb.description,
						'url', cdb.url,
						'contact',cnt.contactname,
						'email', cnt.email) as database,
    cu.siteid,
    ds.datasetid,
    dst.datasettype
  from ndb.constituentdatabases AS cdb
  left join ndb.datasetdatabases as dsdb on cdb.databaseid = dsdb.databaseid
  left join ndb.datasets as ds on ds.datasetid = dsdb.datasetid
  left join ndb.collectionunits as cu on cu.collectionunitid = ds.collectionunitid
  left join ndb.datasettypes as dst on dst.datasettypeid = ds.datasettypeid
  left join ndb.contacts as cnt on cdb.contactid = cnt.contactid
  WHERE (${dbid} IS NULL OR cdb.databaseid = ${dbid})
), sites as (
	select
		dst.databaseid,	
		dst.database,
	    COUNT(DISTINCT dst.siteid)::int as sitecount
	from
		constdb as dst
	group by
		dst.database,
		dst.databaseid
), grouped as (
	select
	  st.database,
	  st.sitecount,
	  CASE WHEN cdb.datasettype IS NULL THEN NULL
	       ELSE jsonb_build_object('datasettype', cdb.datasettype, 'datasets', COUNT(DISTINCT cdb.datasetid)::int)
	  END as datasettypes
	  from sites as st
	  inner join constdb as cdb on cdb.databaseid = st.databaseid
	  group by cdb.datasettype,
	  st.database,
	  st.sitecount
)
SELECT 
	database,
	sitecount,
	array_agg(datasettypes) FILTER (WHERE datasettypes IS NOT NULL) AS datasettypes
from grouped
group by
	database,
	sitecount