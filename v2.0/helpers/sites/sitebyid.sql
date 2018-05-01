SELECT json_build_object('siteid', sts.siteid,
                       'sitename', sts.sitename, 
                       'altitude', sts.altitude,
                       'geography', ST_AsGeoJSON(sts.geog,5,2),
                       'description', sts.sitedescription) AS site,
       json_agg(json_build_object('collectionunitid', clu.collectionunitid,
                                  'collectionunit', clu.collunitname,
                                  'handle', clu.handle,
                                  'unittype', cts.colltype,
                                  'datasetid', dts.datasetid,
                                  'datasettype', dst.datasettype)) AS dataset
FROM
ndb.datasets AS dts LEFT OUTER JOIN
ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid LEFT OUTER JOIN
ndb.sites AS sts ON sts.siteid = clu.siteid  LEFT OUTER JOIN
ndb.datasettypes AS dst ON dst.datasettypeid = dts.datasettypeid LEFT OUTER JOIN
ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid WHERE
sts.siteid IN ($1:csv)
GROUP BY sts.siteid;