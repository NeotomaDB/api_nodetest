WITH sitid AS 
	(SELECT * 
		FROM ndb.sitegeopolitical AS sgp
		WHERE
		(${gpid} IS NULL OR sgp.geopoliticalid IN (${gpid:csv}))
	)

SELECT
	  samples.sampleid AS sampleid,
	  json_build_object(    'taxonid', tx.taxonid, 
	  	                  'taxonname', tx.taxonname,
	  	                      'value', data.value,
	  	                'sampleunits', varu.variableunits) AS sample,
	  json_build_object(        'age', ages.age,  
	  	                   'ageolder', ages.ageolder, 
	  	                 'ageyounger', ages.ageyounger) AS age,
	  json_build_object(  'datasetid', ds.datasetid, 
	  	                     'siteid', sts.siteid, 
	  	                   'sitename', sts.sitename, 
	                       'altitude', sts.altitude, 
	                       'location', ST_AsGeoJSON(sts.geog,5,2), 
	                    'datasettype', dt.datasettype, 
	                       'database', cdb.databasename) AS site  
	FROM
	ndb.samples AS samples
	LEFT JOIN            ndb.data AS data    ON samples.sampleid = data.sampleid
	LEFT JOIN       ndb.variables AS var     ON data.variableid = var.variableid
	LEFT JOIN   ndb.variableunits AS varu    ON var.variableunitsid  = varu.variableunitsid
	LEFT JOIN  ndb.samplekeywords AS sampkey ON samples.sampleid = sampkey.sampleid
	LEFT JOIN        ndb.datasets AS ds      ON samples.datasetid = ds.datasetid 
	LEFT JOIN ndb.collectionunits AS cu      ON ds.collectionunitid = cu.collectionunitid
	LEFT JOIN           ndb.sites AS sts     ON cu.siteid = sts.siteid
	LEFT JOIN      ndb.sampleages AS ages    ON ages.sampleid = samples.sampleid
	LEFT JOIN            ndb.taxa AS tx      ON var.taxonid = tx.taxonid
	LEFT JOIN    ndb.datasettypes AS dt      ON ds.datasettypeid = dt.datasettypeid
	LEFT JOIN (ndb.datasetdatabases AS dd
	           LEFT JOIN ndb.constituentdatabases AS cdb ON dd.databaseid = cdb.databaseid
	          ) ON ds.datasetid = dd.datasetid
WHERE 
	(${taxonname} IS NULL OR tx.taxonname LIKE ${taxonname}) AND
	(${taxonid} IS NULL OR var.taxonid IN (${taxonid:csv})) AND
	(${siteid} IS NULL OR sts.siteid IN (${siteid:csv})) AND
	(${sitename} IS NULL OR sts.sitename LIKE ${sitename}) AND
 	(${datasettype} IS NULL OR dt.datasettype LIKE ${datasettype}) AND
 	(${altmin} IS NULL OR sts.altitude > ${altmin}) AND
	(${altmax} IS NULL OR sts.altitude > ${altmax}) AND
	(${loc} IS NULL OR st_contains(ST_GeomFromText(${loc}), sts.geom)) AND
	sts.siteid IN (SELECT siteid FROM sitid) AND
	(${age} IS NULL OR ages.ageolder > ${age} AND ages.ageyounger < ${age}) AND
	(${ageold} IS NULL OR ages.ageolder > ${ageold}) AND
	(${ageyoung} IS NULL OR ages.ageyounger > ${ageyoung})
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
