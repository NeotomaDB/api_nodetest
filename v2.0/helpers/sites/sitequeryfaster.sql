WITH collunit AS (
  SELECT bigq.siteid,
       bigq.collectionunit
  FROM
     ap.querytable AS bigq
     LEFT JOIN ndb.datasetdoi AS dsdoi ON dsdoi.datasetid = bigq.datasetid
     LEFT OUTER JOIN ndb.constituentdatabases AS cdb ON cdb.databaseid = bigq.databaseid
  WHERE
    (${sitename} IS NULL OR bigq.sitename ILIKE ANY(${sitename}))
    AND (${ageof} IS NULL OR        ${ageof} BETWEEN bigq.younger AND bigq.older)
    AND (${ageold} IS NULL OR       ${ageold} <= bigq.older)
    AND (${ageyoung} IS NULL OR     ${ageyoung} >= bigq.younger)
    AND (${altmax} IS NULL OR bigq.altitude <= ${altmax})
    AND (${altmin} IS NULL OR bigq.altitude >= ${altmin})
    AND (${contacts} IS NULL OR bigq.contacts && ${contacts})
    AND (${database} IS NULL OR cdb.databasename ILIKE ANY(${database}))
    AND (${datasetid} IS NULL OR bigq.datasetid = ANY(${datasetid}))
    AND (${datasettype} IS NULL OR bigq.datasettype = ${datasettype})
    AND (${doi} IS NULL OR dsdoi.doi = ANY(${doi}))
    AND (${gpid} IS NULL OR bigq.geopol && ${gpid})
    AND (${keywords} IS NULL OR bigq.keywords && ${keywords})
    AND (${loc}    IS NULL OR NOT ST_Disjoint(ST_GeogFromText(${loc})::geometry, bigq.geog::geometry))
    AND (${maxage} IS NULL OR        ${maxage} >= bigq.younger)
    AND (${minage} IS NULL OR        ${minage} <= bigq.older)
    AND (${siteid} IS NULL OR bigq.siteid = ANY(${siteid}))
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
