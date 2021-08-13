SELECT sgp.siteid, 
       jsonb_agg(jsonb_build_object(
           'geopoliticalid', gpu.geopoliticalid,
           'geopoliticalname', gpu.geopoliticalname,
           'geopoliticalunit', gpu.geopoliticalunit,
           'rank', gpu.rank,
           'highergeopoliticalid', gpu.highergeopoliticalid)) AS geopoliticalunits
FROM ndb.geopoliticalunits AS gpu
INNER JOIN ndb.sitegeopolitical AS sgp ON sgp.geopoliticalid = gpu.geopoliticalid
WHERE 
  sgp.siteid = ANY(${siteid})
GROUP BY sgp.siteid
LIMIT ${limit}
OFFSET ${offset}