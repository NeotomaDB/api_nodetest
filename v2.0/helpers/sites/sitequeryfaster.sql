WITH collunit AS (
	SELECT bigq.siteid,
		   bigq.collectionunit
	FROM
		 ap.querytable AS bigq
	WHERE
	  (${sitename} IS NULL OR bigq.sitename ILIKE ${sitename})
	  AND (${altmin} IS NULL OR bigq.altitude >= ${altmin})
	  AND (${altmax} IS NULL OR bigq.altitude <= ${altmax})
	  AND (${loc}    IS NULL OR ST_Intersects(ST_GeogFromText(${loc}), bigq.geog))
	  AND (${siteid} IS NULL OR bigq.siteid = ${siteid})
	  AND ${gpid} IS NULL OR bigq.geopol = ${gpid}
)
SELECT sts.siteid,
       sts.sitename as sitename,
       sts.sitedescription AS sitedescription,
       ST_AsGeoJSON(sts.geog,5,2) as geography,
       sts.altitude AS altitude,
  	   json_agg(cus.collectionunit) AS collectionunits
FROM
   (SELECT * FROM collunit) AS cus
   LEFT JOIN ndb.sites AS sts ON cus.siteid = sts.siteid
GROUP BY sts.siteid
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
                 ELSE ${offset}
            END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
			ELSE ${limit}
		END)
