WITH mincalage AS (
    SELECT DISTINCT calage,
	ABS(calage - ${age})
    FROM ap.icesheets
    order by ABS(calage - ${age}) asc
    limit 1
)
SELECT array_agg(gid) AS gid,
    (array_agg(age))[1] AS age,
    (array_agg(calage))[1] as calibrated,
        ST_AsEWKT(
            ST_Simplify(
                ST_Transform(
                    ST_UNION(ST_MakeValid(geom)), ${proj}),${prec}, false),
        LENGTH(TRIM(TRAILING '0' FROM SPLIT_PART(${prec}::text, '.', 2)))) as geom 
FROM ap.icesheets
WHERE calage = (SELECT calage FROM mincalage);