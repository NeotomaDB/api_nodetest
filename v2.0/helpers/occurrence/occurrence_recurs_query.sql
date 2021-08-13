WITH RECURSIVE lowertaxa AS (SELECT
               txa.taxonid,
               txa.highertaxonid,
               txa.taxonname,
               ARRAY[txa.taxonid] AS path
         FROM ndb.taxa AS txa
        WHERE
          (${taxonname} IS NULL OR LOWER(txa.taxonname) LIKE ANY (${taxonname}))
          AND (${taxonid} IS NULL OR txa.taxonid = ANY (${taxonid}))
        UNION ALL
       SELECT txa.taxonid, txa.highertaxonid, txa.taxonname, lt.path || txa.taxonid AS path
         FROM ndb.taxa AS txa
         JOIN lowertaxa AS lt ON lt.taxonid = txa.highertaxonid
        WHERE LOWER(txa.taxonname) NOT LIKE ANY (${taxondrop}))
SELECT
	       data.dataid AS occid,
	  samples.sampleid AS sample,
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
	LEFT OUTER JOIN       ndb.variables AS var     ON var.taxonid = lowertaxa.taxonid
	LEFT OUTER JOIN            ndb.data AS data     ON data.variableid = var.variableid
	LEFT OUTER JOIN         ndb.samples AS samples ON samples.sampleid = data.sampleid
	LEFT OUTER JOIN   ndb.variableunits AS varu    ON var.variableunitsid  = varu.variableunitsid
	LEFT OUTER JOIN  ndb.samplekeywords AS sampkey ON samples.sampleid = sampkey.sampleid
	LEFT OUTER JOIN         ndb.dslinks AS links   ON samples.datasetid = links.datasetid
	LEFT OUTER JOIN        ndb.datasets AS ds      ON samples.datasetid = ds.datasetid
	LEFT OUTER JOIN           ndb.sites AS sts     ON links.siteid = sts.siteid
	LEFT OUTER JOIN      ndb.sampleages AS ages    ON ages.sampleid = samples.sampleid
	LEFT OUTER JOIN    ndb.datasettypes AS dt      ON ds.datasettypeid = dt.datasettypeid
	LEFT OUTER JOIN (ndb.datasetdatabases AS dd
	           LEFT OUTER JOIN ndb.constituentdatabases AS cdb ON dd.databaseid = cdb.databaseid
	          ) ON ds.datasetid = dd.datasetid
WHERE
        (${occurrenceid} IS NULL OR data.dataid = ANY (${occurrenceid}))       AND
	     (${siteid} IS NULL OR links.siteid = ANY (${siteid}))     AND
   	 (${sitename} IS NULL OR sts.sitename   LIKE ${sitename})    AND
 	(${datasettype} IS NULL OR dt.datasettype LIKE ${datasettype}) AND
 	     (${altmin} IS NULL OR sts.altitude > ${altmin})           AND
	     (${altmax} IS NULL OR sts.altitude > ${altmax})           AND
	        (${loc} IS NULL OR ST_Intersects(ST_GeogFromText(${loc}), sts.geog)) AND
	   (${ageyoung} IS NULL OR
		CASE WHEN  ages.ageyounger IS NOT NULL
		     THEN (ages.ageyounger > ${ageyoung})
		     ELSE (ages.age > ${ageyoung}) END) AND
	(${ageold} IS NULL OR
		CASE WHEN  ages.ageolder IS NOT NULL
		     THEN (ages.ageolder < ${ageold})
		     ELSE (ages.age < ${ageold}) END)

OFFSET (CASE WHEN ${offset} IS NULL THEN 0
             ELSE ${offset}
        END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
