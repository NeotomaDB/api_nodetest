WITH dssites AS (
  SELECT
    dts.datasetid AS datasetid,
    sts.siteid AS siteid,
    clu.collectionunitid AS collectionunitid,
    cstdb.databasename AS constituentdatabase,
    jsonb_build_object(       'siteid', sts.siteid,
                           'sitename', sts.sitename,
                    'sitedescription', sts.sitedescription,
                          'sitenotes', sts.notes,
                          'geography', ST_AsGeoJSON(sts.geog,5,2),
                           'altitude', sts.altitude,
                   'collectionunitid', clu.collectionunitid,
                     'collectionunit', clu.collunitname,
                             'handle', clu.handle,
                           'unittype', cts.colltype)
    AS sites
    FROM
      ndb.datasets AS dts
      LEFT OUTER JOIN     ndb.collectionunits  AS clu      ON clu.collectionunitid = dts.collectionunitid
      LEFT OUTER JOIN               ndb.sites  AS sts      ON sts.siteid = clu.siteid
      LEFT OUTER JOIN        ndb.datasettypes  AS dst      ON dst.datasettypeid = dts.datasettypeid
      LEFT OUTER JOIN         ndb.datasetdoi   AS doi      ON dts.datasetid = doi.datasetid
      LEFT OUTER JOIN     ndb.collectiontypes  AS cts      ON clu.colltypeid = cts.colltypeid
      LEFT OUTER JOIN          ndb.datasetpis  AS dspi     ON dspi.datasetid = dts.datasetid
      LEFT OUTER JOIN            ndb.contacts  AS cnt      ON cnt.contactid = dspi.contactid
      LEFT OUTER JOIN         ndb.dsageranges  AS agerange ON dts.datasetid = agerange.datasetid
      LEFT OUTER JOIN            ndb.agetypes  AS agetypes ON agetypes.agetypeid = agerange.agetypeid
      LEFT OUTER JOIN ndb.datasetdatabases     AS dsdb     ON dsdb.datasetid = dts.datasetid
      LEFT OUTER JOIN ndb.constituentdatabases AS cstdb    ON dsdb.databaseid = cstdb.databaseid
      WHERE
            (${database} = cstdb.databasename)

    GROUP BY sts.siteid, clu.collectionunitid, cts.colltype, dts.datasetid, cstdb.databasename

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
                             'agerange', json_build_object('ageyoung', agerange.younger,
                                                           'ageold', agerange.older,
                                                           'units', agetypes.agetype))
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
      cstdb.databasename,
      agerange.younger,
      agerange.older,
      agetypes.agetype
  )
SELECT  json_build_object('site', dssites.sites,
                          'datasets', json_agg(dspiagg.dataset)) AS sites
FROM
  (SELECT * FROM dssites) AS dssites
  LEFT OUTER JOIN (SELECT * FROM dspiagg) AS dspiagg ON dssites.datasetid = dspiagg.datasetid
GROUP BY
  dssites.sites
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
             ELSE ${offset}
        END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
