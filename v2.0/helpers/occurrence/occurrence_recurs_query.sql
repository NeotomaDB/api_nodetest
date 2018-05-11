WITH RECURSIVE lowertaxa AS (SELECT
              txa.taxonid, 
              txa.highertaxonid,
              txa.taxonname
         FROM ndb.taxa AS txa
        WHERE
          (${taxonname} IS NULL OR txa.taxonname  LIKE ${taxonname}) AND
          (${taxonid} IS NULL OR txa.taxonid = ANY (${taxonid}))
        UNION ALL
       SELECT m.taxonid, m.highertaxonid, m.taxonname
         FROM ndb.taxa AS m
         JOIN lowertaxa ON lowertaxa.taxonid = m.highertaxonid)
SELECT
	  samples.sampleid AS sampleid,
	  json_build_object(    'taxonid', lowertaxa.taxonid, 
	  	                  'taxonname', lowertaxa.taxonname,
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
	lowertaxa
	INNER JOIN       ndb.variables AS var     ON var.taxonid = lowertaxa.taxonid
	INNER JOIN            ndb.data AS data     ON data.variableid = var.variableid
	INNER JOIN         ndb.samples AS samples ON samples.sampleid = data.sampleid
	INNER JOIN   ndb.variableunits AS varu    ON var.variableunitsid  = varu.variableunitsid
	INNER JOIN  ndb.samplekeywords AS sampkey ON samples.sampleid = sampkey.sampleid
	INNER JOIN         ndb.dslinks AS links   ON samples.datasetid = links.datasetid
	INNER JOIN        ndb.datasets AS ds      ON samples.datasetid = ds.datasetid 
	INNER JOIN           ndb.sites AS sts     ON links.siteid = sts.siteid
	INNER JOIN      ndb.sampleages AS ages    ON ages.sampleid = samples.sampleid
	INNER JOIN    ndb.datasettypes AS dt      ON ds.datasettypeid = dt.datasettypeid
	INNER JOIN (ndb.datasetdatabases AS dd
	           INNER JOIN ndb.constituentdatabases AS cdb ON dd.databaseid = cdb.databaseid
	          ) ON ds.datasetid = dd.datasetid
WHERE
	(${siteid} IS NULL OR links.siteid = ANY (${siteid})) AND
	(${sitename} IS NULL OR sts.sitename LIKE ${sitename}) AND
 	(${datasettype} IS NULL OR dt.datasettype LIKE ${datasettype}) AND
 	(${altmin} IS NULL OR sts.altitude > ${altmin}) AND
	(${altmax} IS NULL OR sts.altitude > ${altmax}) AND
	(${loc} IS NULL OR st_contains(ST_SetSRID(ST_GeomFromText(${loc}), 4326), sts.geom)) AND
	(${ageyoung} IS NULL OR 
		CASE WHEN ages.ageyounger IS NOT NULL 
		     THEN (ages.ageyounger > ${ageyoung})
		     ELSE (ages.age > ${ageyoung}) END) AND
	(${ageold} IS NULL OR 
		CASE WHEN ages.ageolder IS NOT NULL 
		     THEN (ages.ageolder < ${ageold})
		     ELSE (ages.age < ${ageold}) END)

OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
