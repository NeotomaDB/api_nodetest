SELECT gid, 
       spid,
       sciname, 
       ST_AsGeoJSON(ST_ReducePrecision(ST_Transform(the_geom,3857),1)) as the_geom 
FROM ap.faunranges 
WHERE sciname = ${sciname} AND sciname IS NOT NULL
LIMIT 1;