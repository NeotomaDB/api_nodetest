SELECT array_agg(gid) AS gid,
       array_agg(spid) AS spid,
       array_agg(sciname) AS sciname,
        ST_AsEWKT(
            ST_Simplify(
                ST_Transform(
                    ST_UNION(the_geom), ${proj}),${prec}, false),
        LENGTH(TRIM(TRAILING '0' FROM SPLIT_PART(${prec}::text, '.', 2)))) as geom 
FROM ap.faunranges 
WHERE sciname ILIKE ${sciname} AND sciname IS NOT NULL;