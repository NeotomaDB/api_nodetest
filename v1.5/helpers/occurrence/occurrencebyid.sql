SELECT
	  data.dataid AS occurrence, 
	  samples.sampleid AS sample,
	  json_build_object('taxonid', tx.taxonid, 'taxonname', tx.taxonname) AS taxon,
	  json_build_object('age', ages.age,  'ageolder', ages.ageolder, 'ageyounger', ages.ageyounger) AS ages,
	  json_build_object('datasetid', ds.datasetid, 'siteid', sts.siteid, 'sitename', sts.sitename, 
	                    'altitude', sts.altitude, 'location', ST_AsGeoJSON(sts.geog,5,2), 
	                    'datasettype', dt.datasettype, 'database', cdb.databasename) AS site  
	FROM
	ndb.samples AS samples
	LEFT OUTER JOIN ndb.data AS data ON samples.sampleid = data.sampleid
	LEFT OUTER JOIN ndb.variables AS var ON data.variableid = var.variableid
	LEFT OUTER JOIN ndb.samplekeywords AS sampkey on samples.sampleid = sampkey.sampleid
	LEFT OUTER JOIN ndb.datasets AS ds ON samples.datasetid = ds.datasetid 
	LEFT OUTER JOIN ndb.collectionunits AS cu ON ds.collectionunitid = cu.collectionunitid
	LEFT OUTER JOIN ndb.sites AS sts ON cu.siteid = sts.siteid
	LEFT OUTER JOIN ndb.sampleages AS ages ON ages.sampleid = samples.sampleid
	LEFT OUTER JOIN ndb.taxa AS tx on var.taxonid = tx.taxonid
	LEFT OUTER JOIN ndb.datasettypes AS dt ON ds.datasettypeid = dt.datasettypeid
	LEFT OUTER JOIN (ndb.datasetdatabases AS dd 
	LEFT OUTER JOIN ndb.constituentdatabases AS cdb ON dd.databaseid = cdb.databaseid) ON ds.datasetid = dd.datasetid
WHERE 
	data.dataid IN ($1:csv);