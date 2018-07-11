SELECT json_agg(json_build_object('siteid', sts.siteid, 
                                'sitename', sts.sitename,
                         'sitedescription', sts.sitedescription,
                               'geography', ST_AsGeoJSON(sts.geog,5,2),
                                'altitude', sts.altitude,
                        'collectionunitid', clu.collectionunitid,
                          'collectionunit', clu.collunitname,
                                  'handle', clu.handle,
                                'unittype', cts.colltype, 
                               'datasetid', dts.datasetid,
                             'datasettype', dst.datasettype)) as site,
       dspi.contactid AS contactid
FROM
       ndb.datasets AS  dts LEFT OUTER JOIN
ndb.collectionunits AS  clu ON clu.collectionunitid = dts.collectionunitid LEFT OUTER JOIN
          ndb.sites AS  sts ON sts.siteid = clu.siteid  LEFT OUTER JOIN
ndb.collectiontypes AS  cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
   ndb.datasettypes AS  dst ON dst.datasettypeid = dts.datasettypeid LEFT OUTER JOIN
     ndb.datasetpis AS dspi ON dts.datasetid = dspi.datasetid
WHERE
dspi.contactid IN ($1:csv)
GROUP BY contactid;