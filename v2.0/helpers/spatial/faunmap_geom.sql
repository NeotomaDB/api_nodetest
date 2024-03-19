SELECT array_agg(gid) AS gid,
       array_agg(spid) AS spid,
       array_agg(sciname) AS sciname,
       ST_AsGeoJSON(ST_UNION(ST_ReducePrecision(ST_Transform(the_geom,3857),${prec}))) as the_geom 
FROM ap.faunranges 
WHERE sciname ILIKE ${sciname} AND sciname IS NOT NULL
LIMIT 1;