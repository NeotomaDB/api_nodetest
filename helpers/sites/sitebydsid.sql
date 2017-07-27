SELECT sts.siteid AS siteid, sts.sitename as sitename, 
       ST_AsGeoJSON(sts.geog,5,2) as geography,
       sts.altitude AS altitude, 
       clu.collectionunitid as collectionunitid,
       clu.collunitname AS collectionunit,
       clu.handle AS handle,
       cts.colltype AS unittype, 
       dts.datasetid AS datasetid,
       dst.datasettype AS datasettype FROM 
ndb.datasets AS dts LEFT OUTER JOIN
ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid LEFT OUTER JOIN
ndb.sites AS sts ON sts.siteid = clu.siteid  LEFT OUTER JOIN
ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
ndb.datasettypes as dst ON dst.datasettypeid = dts.datasettypeid
WHERE
dts.datasetid IN ($1:csv);