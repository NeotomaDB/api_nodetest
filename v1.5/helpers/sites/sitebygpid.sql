WITH RECURSIVE allgpu AS (SELECT gpu.geopoliticalid, gpu.highergeopoliticalid
                               FROM ndb.geopoliticalunits AS gpu
                              WHERE gpu.geopoliticalid IN ($1:csv)
                              UNION ALL
                             SELECT m.geopoliticalid, m.highergeopoliticalid
                               FROM ndb.geopoliticalunits AS m
                               JOIN allgpu ON allgpu.geopoliticalid = m.highergeopoliticalid)
SELECT json_build_object('geopoliticalid', gpu.geopoliticalid,
                         'geopoliticalname', gpu.geopoliticalname,
                         'geopoliticalunit', gpu.geopoliticalunit,
                         'rank', gpu.rank,
                         'highergeopoliticalid', gpu.highergeopoliticalid) AS geopoliticalunit,
       json_agg(
         json_build_object('siteid', sts.siteid, 
                           'sitename', sts.sitename, 
                           'sitedescription', sts.sitedescription, 
                           'geography', ST_AsGeoJSON(sts.geog,5,2), 
                           'altitude', sts.altitude,
                           'collectionunitid', clu.collectionunitid,
                           'collectionunitname', clu.collunitname,
                           'handle', clu.handle,
                           'collectiontype', cts.colltype)) AS sites
FROM
allgpu  LEFT OUTER JOIN
ndb.geopoliticalunits AS gpu ON gpu.geopoliticalid IN (allgpu.geopoliticalid) LEFT OUTER JOIN
ndb.sitegeopolitical AS sgp ON sgp.geopoliticalid IN (allgpu.geopoliticalid) LEFT OUTER JOIN
ndb.sites AS sts ON sts.siteid = sgp.siteid LEFT OUTER JOIN
ndb.collectionunits AS clu ON clu.siteid = sts.siteid LEFT OUTER JOIN
ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
ndb.datasets AS dts ON dts.collectionunitid = clu.collectionunitid LEFT OUTER JOIN
ndb.datasettypes as dst ON dst.datasettypeid = dts.datasettypeid 
GROUP BY gpu.geopoliticalid;
