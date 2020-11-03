WITH sitid AS 
(SELECT * FROM ndb.sitegeopolitical AS sgp WHERE
(${gpid} IS NULL OR sgp.geopoliticalid = ${gpid}))
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
ndb.datasets AS dts LEFT OUTER JOIN
ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid LEFT OUTER JOIN
ndb.sites AS sts ON sts.siteid = clu.siteid  LEFT OUTER JOIN
ndb.datasettypes as dst ON dst.datasettypeid = dts.datasettypeid LEFT OUTER JOIN
ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid WHERE
(${sitename} IS NULL OR sts.sitename LIKE ${sitename})
AND (${altmin} IS NULL OR sts.altitude >= ${altmin})
AND (${altmax} IS NULL OR sts.altitude <= ${altmax})
AND (${siteid} IS NULL OR sts.siteid IN ${siteid})
AND sts.siteid IN (SELECT siteid FROM sitid)
