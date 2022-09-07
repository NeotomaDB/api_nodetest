WITH dssitesid AS (
	SELECT bigq.datasetid, bigq.siteid, bigq.collectionunitid
	FROM
		 ap.querytable AS bigq
	WHERE
	  (${sitename} IS NULL OR bigq.sitename ILIKE ${sitename})
	  AND (${altmin} IS NULL OR bigq.altitude >= ${altmin})
	  AND (${altmax} IS NULL OR bigq.altitude <= ${altmax})
	  AND (${loc}    IS NULL OR ST_Intersects(ST_GeogFromText(${loc}), bigq.geog))
	  AND (${siteid} IS NULL OR bigq.siteid = ANY(${siteid}))
	  AND (${gpid} IS NULL OR bigq.geopol && ${gpid})
	  AND (${keywords} IS NULL OR bigq.keywords && ${keywords})
	  AND (${contacts} IS NULL OR bigq.contacts && ${contacts})
	  AND (${taxa} IS NULL OR bigq.taxa && ${taxa})
      AND (${datasettype} IS NULL OR bigq.datasettype LIKE ${datasettype})
      AND (${altmin} IS NULL OR    bigq.altitude > ${altmin})    
      AND (${altmax} IS NULL OR    bigq.altitude < ${altmax})    
      AND (${ageyoung} IS NULL OR     ${ageyoung} > bigq.younger)
      AND (${ageold} IS NULL OR       ${ageold} < bigq.older)
      AND (${ageof} IS NULL OR        ${ageof} BETWEEN bigq.younger AND bigq.older)
      AND ((${datasetid}) IS NULL OR dts.datasetid = ANY (${datasetid}))
),
dspiagg AS (
    SELECT
  	dssites.datasetid AS datasetid,
  	dssites.siteid AS siteid,
  	dssites.collectionunitid AS collectionunitid,
    jsonb_build_object('datasetid', dssites.datasetid,
                       'datasettype', dst.datasettype,

                       'datasetnotes', dts.notes,
                       'database', cstdb.databasename,
                       'doi', json_agg(DISTINCT doi.doi),
                       'datasetpi', json_agg(json_build_object('contactid', cnt.contactid,
                                                            'contactname', cnt.contactname,
                                                            'familyname', cnt.familyname,
                                                            'firstname', cnt.givennames,
                                                            'initials', cnt.leadinginitials)),
                             'agerange', json_agg(DISTINCT jsonb_build_object('ageyoung', agerange.younger,
                                                           'ageold', agerange.older,
                                                           'units', agetypes.agetype)))
                             AS dataset
  	FROM
  	(SELECT * FROM dssites) AS dssites
    LEFT OUTER JOIN ndb.datasets             AS dts      ON dts.datasetid = dssites.datasetid
  	LEFT OUTER JOIN ndb.collectionunits      AS clu      ON clu.collectionunitid = dts.collectionunitid
  	LEFT OUTER JOIN ndb.datasettypes         AS dst      ON dst.datasettypeid = dts.datasettypeid
    LEFT OUTER JOIN ndb.datasetdoi           AS doi      ON dts.datasetid = doi.datasetid
  	LEFT OUTER JOIN ndb.datasetdatabases     AS dsdb     ON dsdb.datasetid = dts.datasetid
  	LEFT OUTER JOIN ndb.datasetpis           AS dspi     ON dspi.datasetid = dts.datasetid
  	LEFT OUTER JOIN ndb.contacts             AS cnt      ON cnt.contactid = dspi.contactid
  	LEFT OUTER JOIN ndb.dsageranges          AS agerange ON dts.datasetid = agerange.datasetid
  	LEFT OUTER JOIN ndb.agetypes             AS agetypes ON agetypes.agetypeid = agerange.agetypeid
  	LEFT OUTER JOIN ndb.constituentdatabases AS cstdb    ON dsdb.databaseid = cstdb.databaseid
  	LEFT OUTER JOIN ndb.sites                AS sts      ON sts.siteid = clu.siteid
    GROUP BY
  	  dssites.siteid,
      dssites.collectionunitid,
      dssites.datasetid,
      dst.datasettype,
      dts.notes,
      cstdb.databasename
  )
SELECT json_build_object(       'siteid', sts.siteid,
                              'sitename', sts.sitename,
                       'sitedescription', sts.sitedescription,
                             'sitenotes', sts.notes,
                             'geography', ST_AsGeoJSON(sts.geog,5,2),
                              'altitude', sts.altitude,
                      'collectionunitid', clu.collectionunitid,
                        'collectionunit', clu.collunitname,
                                'handle', clu.handle,
                              'unittype', cts.colltype,
						'datasets', json_agg(dspi.dataset)) as site
FROM ndb.datasets AS dts
  LEFT OUTER JOIN dspiagg             AS dspi ON dspi.datasetid = dts.datasetid
  LEFT OUTER JOIN ndb.collectionunits AS clu  ON clu.collectionunitid = dts.collectionunitid
  LEFT OUTER JOIN ndb.sites           AS sts  ON sts.siteid = clu.siteid
  LEFT OUTER JOIN ndb.collectiontypes as cts  ON clu.colltypeid = cts.colltypeid
WHERE dts.datasetid = ANY ($1)
GROUP BY
  dssites.sites
    OFFSET (CASE WHEN ${offset} IS NULL THEN 0
                 ELSE ${offset}
            END)
    LIMIT (CASE WHEN ${limit} IS NULL THEN 25
                ELSE ${limit}
           END);