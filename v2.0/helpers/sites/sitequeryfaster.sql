WITH collunit AS (
	SELECT bigq.siteid,
		   bigq.collectionunit
	FROM
		 ap.querytable AS bigq
		 LEFT JOIN ndb.datasetdoi AS dsdoi ON dsdoi.datasetid = bigq.datasetid
		 INNER JOIN ndb.constituentdatabases AS cdb ON cdb.databaseid = bigq.databaseid
	WHERE
	  (${sitename} IS NULL OR bigq.sitename ILIKE ANY(${sitename}))
	  AND (${database} IS NULL OR cdb.databasename ILIKE ANY(${database}))
	  AND (${datasettype} IS NULL OR bigq.datasettype = ${datasettype})
	  AND (${altmin} IS NULL OR bigq.altitude >= ${altmin})
	  AND (${altmax} IS NULL OR bigq.altitude <= ${altmax})
	  AND (${loc}    IS NULL OR NOT ST_Disjoint(ST_GeogFromText(${loc})::geometry, bigq.geog::geometry))
	  AND (${siteid} IS NULL OR bigq.siteid = ANY(${siteid}))
	  AND (${datasetid} IS NULL OR bigq.datasetid = ANY(${datasetid}))
	  AND (${doi} IS NULL OR dsdoi.doi = ANY(${doi}))
	  AND (${gpid} IS NULL OR bigq.geopol && ${gpid})
	  AND (${keywords} IS NULL OR bigq.keywords && ${keywords})
	  AND (${contacts} IS NULL OR bigq.contacts && ${contacts})
	  AND (${taxa} IS NULL OR bigq.taxa && ${taxa})
)
SELECT sts.siteid,
       sts.sitename as sitename,
       sts.sitedescription AS sitedescription,
       ST_AsGeoJSON(sts.geog,5,2) as geography,
       sts.altitude AS altitude,
  	   json_agg(DISTINCT cus.collectionunit) AS collectionunits
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
