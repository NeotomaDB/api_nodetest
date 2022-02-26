WITH sitid AS (
  SELECT *
  FROM
    ndb.sitegeopolitical AS sgp
  WHERE
    (${gpid} IS NULL OR sgp.geopoliticalid = ANY(${gpid}))
),
collunit AS (
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
		 LEFT JOIN           ndb.sites AS sts ON           sts.siteid = clu.siteid
		 LEFT OUTER JOIN    ndb.datasettypes AS dst ON    dst.datasettypeid = dts.datasettypeid
		 LEFT OUTER JOIN ndb.collectiontypes AS cts ON       clu.colltypeid = cts.colltypeid
	WHERE
	  (${sitename} IS NULL OR sts.sitename ILIKE ${sitename})
	  AND (${altmin} IS NULL OR sts.altitude >= ${altmin})
	  AND (${altmax} IS NULL OR sts.altitude <= ${altmax})
	  AND (${loc}    IS NULL OR ST_Intersects(ST_GeogFromText(${loc}), sts.geog))
	  AND (${siteid} IS NULL OR sts.siteid = ANY(${siteid}))
	  AND sts.siteid = ANY(SELECT siteid FROM sitid)
	GROUP BY sts.siteid, clu.collectionunitid, cts.colltype
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
		END);
