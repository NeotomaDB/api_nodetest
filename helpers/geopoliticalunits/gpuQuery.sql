WITH gid AS 
  (SELECT * FROM ndb.geopoliticalunits AS gpu 
      WHERE (  ${gpid} IS NULL OR gpu.geopoliticalid = ${gpid})
        AND (${gpname} IS NULL OR gpu.geopoliticalname LIKE ${gpname})
        AND (  ${rank} IS NULL OR gpu.rank = ${rank}))
SELECT * FROM ndb.geopoliticalunits AS gpu 
  WHERE gpu.geopoliticalid IN
    (SELECT geopoliticalid FROM gid)
  UNION ALL
    SELECT * FROM ndb.geopoliticalunits AS gpu
WHERE 
(${lower} IS true AND gpu.highergeopoliticalid IN 
        (SELECT geopoliticalid FROM gid))