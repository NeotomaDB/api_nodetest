-- Pagination is applied to distinct site ids (step 1), and only then are the
-- collection units of those sites collected (step 2). Cutting the collection
-- unit rows before applying OFFSET (the previous `LIMIT limit * 3`) returned
-- short pages, so `limit=50&offset=50` could return 3 sites and a client that
-- pages until it sees a short page stopped early.
--
-- The WHERE block below appears twice (`page` and `collunit`) and the two must
-- stay identical: `page` decides WHICH sites are on the page, `collunit`
-- decides which collection units are listed for them.
WITH page AS (
  SELECT DISTINCT bigq.siteid
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
    AND (${contactid} IS NULL OR bigq.contacts && ${contactid})
    AND (${database} IS NULL OR cdb.databasename ILIKE ANY(${database}))
    AND (${datasetid} IS NULL OR bigq.datasetid = ANY(${datasetid}))
    AND (${datasettype} IS NULL OR bigq.datasettype = ANY(${datasettype}))
    AND (${doi} IS NULL OR dsdoi.doi = ANY(${doi}))
    AND (${gpid} IS NULL OR bigq.geopol && ${gpid})
    AND (${keywords} IS NULL OR bigq.keywords && ${keywords})
    AND (${loc}    IS NULL OR NOT ST_Disjoint(ST_GeogFromText(${loc})::geometry, bigq.geog::geometry))
    AND (${maxage} IS NULL OR        ${maxage} >= bigq.younger)
    AND (${minage} IS NULL OR        ${minage} <= bigq.older)
    AND (${siteid} IS NULL OR bigq.siteid = ANY(${siteid}))
    AND (${taxa} IS NULL OR bigq.taxa && ${taxa})
  ORDER BY bigq.siteid
  LIMIT COALESCE(${limit}, 25)
  OFFSET COALESCE(${offset}, 0)
),
collunit AS (
  SELECT DISTINCT bigq.siteid,
       bigq.collectionunit
  -- OFFSET 0 is a fence: the rows of the page's sites are read first, by siteid, and the
  -- filters below are applied to those rows only (see the same note in datasetqueryfaster.sql).
  FROM
     (SELECT * FROM ap.querytable WHERE siteid IN (SELECT siteid FROM page) OFFSET 0) AS bigq
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
    AND (${contactid} IS NULL OR bigq.contacts && ${contactid})
    AND (${database} IS NULL OR cdb.databasename ILIKE ANY(${database}))
    AND (${datasetid} IS NULL OR bigq.datasetid = ANY(${datasetid}))
    AND (${datasettype} IS NULL OR bigq.datasettype = ANY(${datasettype}))
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
       sts.recdatecreated AS recdatecreated,
       json_agg(DISTINCT cus.collectionunit) AS collectionunits
FROM
   (SELECT * FROM collunit) AS cus
   LEFT JOIN ndb.sites AS sts ON cus.siteid = sts.siteid
GROUP BY sts.siteid
ORDER BY sts.siteid;
