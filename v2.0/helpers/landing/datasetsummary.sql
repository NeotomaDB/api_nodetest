SELECT 
	st.siteid,	
	st.sitename,
	array[round(st_Xmin(st.geog::geometry)::numeric, 3),
	      round(st_ymin(st.geog::geometry)::numeric, 3)] as coords,
	ds.datasetid,
	dst.datasettype
FROM ndb.datasets AS ds
INNER JOIN ndb.datasetdatabases AS dsdb ON dsdb.datasetid = ds.datasetid 
INNER JOIN ndb.collectionunits AS cu ON cu.collectionunitid = ds.collectionunitid
INNER JOIN ndb.sites AS st ON st.siteid = cu.siteid
INNER JOIN ndb.datasettypes AS dst ON dst.datasettypeid = ds.datasettypeid
WHERE dsdb.databaseid = ${dbid};