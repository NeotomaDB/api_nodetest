WITH RECURSIVE allgpu AS (SELECT gpu.geopoliticalid, gpu.highergeopoliticalid
 	                        FROM ndb.geopoliticalunits AS gpu
	                       WHERE gpu.geopoliticalid IN ($1:csv)
	                       UNION ALL
	                      SELECT m.geopoliticalid, m.highergeopoliticalid
	                        FROM ndb.geopoliticalunits AS m
	                        JOIN allgpu ON allgpu.geopoliticalid = m.highergeopoliticalid)
SELECT sts.siteid AS siteid, 
       sts.sitename as sitename,
       sts.sitedescription AS sitedescription,
       ST_AsGeoJSON(sts.geog,5,2) as geography,
       sts.altitude AS altitude, 
       clu.collectionunitid as collectionunitid,
       clu.collunitname AS collectionunit,
       clu.handle AS handle,
       cts.colltype AS unittype, 
       dts.datasetid AS datasetid,
       dst.datasettype AS datasettype FROM
allgpu  LEFT OUTER JOIN
ndb.sitegeopolitical AS sgp ON sgp.geopoliticalid IN (allgpu.geopoliticalid) LEFT OUTER JOIN
ndb.sites AS sts ON sts.siteid = sgp.siteid LEFT OUTER JOIN
ndb.collectionunits AS clu ON clu.siteid = sts.siteid LEFT OUTER JOIN
ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
ndb.datasets AS dts ON dts.collectionunitid = clu.collectionunitid LEFT OUTER JOIN
ndb.datasettypes as dst ON dst.datasettypeid = dts.datasettypeid;