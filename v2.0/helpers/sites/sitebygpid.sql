WITH allgpu AS (
  SELECT DISTINCT siteid, geopoliticalid
  FROM
    ndb.geopaths AS gp
    INNER JOIN ndb.sitegeopolitical AS sgp ON sgp.geopoliticalid = gp.geoin
    WHERE ${gpid} && gp.geoout OR sgp.geopoliticalid = ANY(${gpid})
    OFFSET (CASE WHEN ${offset} IS NULL THEN 0
                 ELSE ${offset}
            END)
    LIMIT (CASE WHEN ${limit} IS NULL THEN 25
                ELSE ${limit}
           END)
 ),
 collu AS (
   SELECT sts.siteid,
    json_build_object('collectionunitid', clu.collectionunitid,
                      'collectionunit', clu.collunitname,
                      'handle', clu.handle,
                      'collectionunittype', cts.colltype,
                      'datasets', json_agg(json_build_object('datasetid', dts.datasetid,
                                                             'datasettype', dst.datasettype))) AS collectionunit
 	FROM
 	  ndb.datasets AS dts
 	  LEFT JOIN ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid
 	  LEFT JOIN ndb.sites AS sts ON sts.siteid = clu.siteid
 	  LEFT JOIN ndb.datasettypes AS dst ON dst.datasettypeid = dts.datasettypeid
 	  LEFT OUTER JOIN ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid
 	GROUP BY sts.siteid, clu.collectionunitid, cts.colltype
 ),
 sites AS (
SELECT 'siteid', sts.siteid AS siteid,
	 json_build_object('siteid', sts.siteid,
              'sitename', sts.sitename,
              'sitedescription', sts.sitedescription,
              'geography', ST_AsGeoJSON(sts.geog,5,2),
              'altitude', sts.altitude,
         	   'collectionunits', json_agg(cus.collectionunit)) AS sites
FROM
  allgpu  LEFT JOIN
  collu AS cus on cus.siteid = allgpu.siteid LEFT OUTER JOIN
  ndb.sitegeopolitical AS sgp ON sgp.geopoliticalid IN (allgpu.geopoliticalid) LEFT OUTER JOIN
  ndb.sites AS sts ON sts.siteid = sgp.siteid LEFT OUTER JOIN
  ndb.collectionunits AS clu ON clu.siteid = sts.siteid LEFT OUTER JOIN
  ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
  ndb.datasets AS dts ON dts.collectionunitid = clu.collectionunitid LEFT OUTER JOIN
  ndb.datasettypes as dst ON dst.datasettypeid = dts.datasettypeid
GROUP BY sts.siteid
 )
SELECT gpu.geopoliticalid AS geopoliticalid,
       gpu.geopoliticalname AS geopoliticalname,
       gpu.geopoliticalunit AS geopoliticalunit,
       gpu.rank AS rank,
       gpu.highergeopoliticalid AS highergeopoliticalid,
       json_agg(sit.sites) AS sites
	   FROM
  allgpu  LEFT JOIN
  sites AS sit on sit.siteid = allgpu.siteid LEFT OUTER JOIN
  ndb.geopoliticalunits AS gpu ON gpu.geopoliticalid IN (allgpu.geopoliticalid)
GROUP BY gpu.geopoliticalid;