-- Pagination unit: one row of the response is one collection unit. The page is
-- chosen first (page_units), straight from ap.querytable and with LIMIT/OFFSET, so
-- that Postgres can stop as soon as it has enough rows. The DOI, PI and age-range
-- aggregates below then run for the datasets of that page only. Before, every
-- matching dataset (thousands for a wildcard site name) was aggregated and the
-- LIMIT was applied last, which ran past the gateway's 120 s limit for limit=10.
--
-- The WHERE block appears twice (page_units and filtered_datasets) and the two must
-- stay identical: the first decides WHICH collection units are on the page, the
-- second decides which datasets are listed inside them.
WITH page_units AS (
    SELECT DISTINCT clu.siteid, clu.collectionunitid
    FROM ap.querytable AS bigq
    LEFT JOIN ndb.datasetdoi AS dsdoi ON dsdoi.datasetid = bigq.datasetid
    LEFT JOIN ndb.constituentdatabases AS cdb ON cdb.databaseid = bigq.databaseid
    JOIN ndb.datasets dts ON dts.datasetid = bigq.datasetid
    JOIN ndb.collectionunits clu ON clu.collectionunitid = dts.collectionunitid AND clu.siteid = bigq.siteid
    WHERE
        (${sitename} IS NULL OR bigq.sitename ILIKE ANY(${sitename}))
        AND (${ageof} IS NULL OR ${ageof} BETWEEN bigq.younger AND bigq.older)
        AND (${ageold} IS NULL OR ${ageold} <= bigq.older)
        AND (${ageyoung} IS NULL OR ${ageyoung} >= bigq.younger)
        AND (${altmax} IS NULL OR bigq.altitude <= ${altmax})
        AND (${altmin} IS NULL OR bigq.altitude >= ${altmin})
        AND (${contacts} IS NULL OR bigq.contacts && ${contacts})
        AND (${database} IS NULL OR cdb.databasename ILIKE ANY(${database}))
        AND (${datasetid} IS NULL OR bigq.datasetid = ANY(${datasetid}))
        AND (${datasettype} IS NULL OR bigq.datasettype LIKE ANY(${datasettype}))
        AND (${doi} IS NULL OR dsdoi.doi = ANY(${doi}))
        AND (${gpid} IS NULL OR bigq.geopol && ${gpid})
        AND (${keywords} IS NULL OR bigq.keywords && ${keywords})
        AND (${loc} IS NULL OR NOT ST_Disjoint(ST_GeogFromText(${loc})::geometry, bigq.geog::geometry))
        AND (${maxage} IS NULL OR ${maxage} >= bigq.younger)
        AND (${minage} IS NULL OR ${minage} <= bigq.older)
        AND (${siteid} IS NULL OR bigq.siteid = ANY(${siteid}))
        AND (${taxa} IS NULL OR bigq.taxa && ${taxa})
        -- site hint (page_units only): when dataset ids are given, start from the sites of those
        -- datasets (primary key lookups). It selects the same rows, because the join above already
        -- requires clu.siteid = bigq.siteid. Without it the planner may walk every collection unit in
        -- order, expecting LIMIT to stop it early, and probe ap.querytable for each one.
        AND (${datasetid} IS NULL OR bigq.siteid IN (
              SELECT c2.siteid FROM ndb.datasets d2
              JOIN ndb.collectionunits c2 ON c2.collectionunitid = d2.collectionunitid
              WHERE d2.datasetid = ANY(${datasetid})))
    ORDER BY clu.siteid, clu.collectionunitid
    LIMIT COALESCE(${limit}, 25)
    OFFSET COALESCE(${offset}, 0)
),
filtered_datasets AS (
    SELECT DISTINCT bigq.siteid, bigq.datasetid
    -- OFFSET 0 is a fence: the rows of the page's sites are read first, by siteid, and the
    -- filters below are applied to those rows only. Without it the planner may re-run the
    -- sitename/taxa indexes once per site on the page, which was minutes on a large table.
    FROM (SELECT * FROM ap.querytable WHERE siteid IN (SELECT siteid FROM page_units) OFFSET 0) AS bigq
    LEFT JOIN ndb.datasetdoi AS dsdoi ON dsdoi.datasetid = bigq.datasetid
    LEFT JOIN ndb.constituentdatabases AS cdb ON cdb.databaseid = bigq.databaseid
    WHERE
        (${sitename} IS NULL OR bigq.sitename ILIKE ANY(${sitename}))
        AND (${ageof} IS NULL OR ${ageof} BETWEEN bigq.younger AND bigq.older)
        AND (${ageold} IS NULL OR ${ageold} <= bigq.older)
        AND (${ageyoung} IS NULL OR ${ageyoung} >= bigq.younger)
        AND (${altmax} IS NULL OR bigq.altitude <= ${altmax})
        AND (${altmin} IS NULL OR bigq.altitude >= ${altmin})
        AND (${contacts} IS NULL OR bigq.contacts && ${contacts})
        AND (${database} IS NULL OR cdb.databasename ILIKE ANY(${database}))
        AND (${datasetid} IS NULL OR bigq.datasetid = ANY(${datasetid}))
        AND (${datasettype} IS NULL OR bigq.datasettype LIKE ANY(${datasettype}))
        AND (${doi} IS NULL OR dsdoi.doi = ANY(${doi}))
        AND (${gpid} IS NULL OR bigq.geopol && ${gpid})
        AND (${keywords} IS NULL OR bigq.keywords && ${keywords})
        AND (${loc} IS NULL OR NOT ST_Disjoint(ST_GeogFromText(${loc})::geometry, bigq.geog::geometry))
        AND (${maxage} IS NULL OR ${maxage} >= bigq.younger)
        AND (${minage} IS NULL OR ${minage} <= bigq.older)
        AND (${siteid} IS NULL OR bigq.siteid = ANY(${siteid}))
        AND (${taxa} IS NULL OR bigq.taxa && ${taxa})
),
-- The matching datasets of the collection units on this page:
page_datasets AS (
    SELECT fds.siteid, fds.datasetid
    FROM filtered_datasets fds
    JOIN ndb.datasets dts ON dts.datasetid = fds.datasetid
    WHERE dts.collectionunitid IN (SELECT collectionunitid FROM page_units)
),
-- Now these CTEs work on the page only
dataset_dois AS (
    SELECT 
        ddoi.datasetid,
        json_agg(DISTINCT ddoi.doi) as dois
    FROM ndb.datasetdoi ddoi
    WHERE ddoi.datasetid IN (SELECT datasetid FROM page_datasets)
    GROUP BY ddoi.datasetid
),
dataset_pis AS (
    SELECT 
        dspi.datasetid,
        json_agg(DISTINCT jsonb_build_object(
            'contactid', cnt.contactid,
            'contactname', cnt.contactname,
            'familyname', cnt.familyname,
            'firstname', cnt.givennames,
            'initials', cnt.leadinginitials
        )) as pis
    FROM ndb.datasetpis dspi
    JOIN ndb.contacts cnt ON cnt.contactid = dspi.contactid
    WHERE dspi.datasetid IN (SELECT datasetid FROM page_datasets)
    GROUP BY dspi.datasetid
),
dataset_ages AS (
    SELECT 
        age_summary.datasetid,
        json_agg(DISTINCT jsonb_build_object(
            'ageyoung', age_summary.min_age,
            'ageold', age_summary.max_age,
            'units', at.agetype
        )) as ageranges
    FROM (
        SELECT 
            smp.datasetid,
            chrons.agetypeid,
            MIN(COALESCE(ages.ageyounger, ages.age)) as min_age,
            MAX(COALESCE(ages.ageolder, ages.age)) as max_age
        FROM ndb.samples smp
        JOIN ndb.sampleages ages ON ages.sampleid = smp.sampleid
        JOIN ndb.chronologies chrons ON chrons.chronologyid = ages.chronologyid
        WHERE smp.datasetid IN (SELECT datasetid FROM page_datasets)
          AND chrons.isdefault = true
        GROUP BY smp.datasetid, chrons.agetypeid
    ) age_summary
    JOIN ndb.agetypes at ON at.agetypeid = age_summary.agetypeid
    GROUP BY age_summary.datasetid
)
SELECT json_build_object(
    'siteid', sts.siteid,
    'sitename', sts.sitename,
    'sitedescription', sts.sitedescription,
    'sitenotes', sts.notes,
    'geography', ST_AsGeoJSON(sts.geog, 5, 2),
    'altitude', sts.altitude,
    'collectionunitid', clu.collectionunitid,
    'collectionunit', clu.collunitname,
    'handle', clu.handle,
    'unittype', cts.colltype,
    'datasets', json_agg(
        jsonb_build_object(
            'datasetid', dts.datasetid,
            'datasettype', dst.datasettype,
            'datasetnotes', dts.notes,
            'database', cstdb.databasename,
            'doi', COALESCE(ddoi.dois, '[]'::json),
            'recdatecreated', dts.recdatecreated,
            'datasetpi', COALESCE(dpis.pis, '[]'::json),
            'agerange', COALESCE(dage.ageranges, '[]'::json)
        )
    )
) as site
FROM page_datasets fds
JOIN ndb.datasets dts ON dts.datasetid = fds.datasetid
JOIN ndb.collectionunits clu ON clu.collectionunitid = dts.collectionunitid
JOIN ndb.sites sts ON sts.siteid = clu.siteid
LEFT JOIN ndb.datasettypes dst ON dst.datasettypeid = dts.datasettypeid
LEFT JOIN ndb.datasetdatabases dsdb ON dsdb.datasetid = dts.datasetid
LEFT JOIN ndb.constituentdatabases cstdb ON dsdb.databaseid = cstdb.databaseid
LEFT JOIN ndb.collectiontypes cts ON clu.colltypeid = cts.colltypeid
LEFT JOIN dataset_dois ddoi ON ddoi.datasetid = fds.datasetid
LEFT JOIN dataset_pis dpis ON dpis.datasetid = fds.datasetid
LEFT JOIN dataset_ages dage ON dage.datasetid = fds.datasetid
GROUP BY 
    sts.siteid, sts.sitename, sts.sitedescription, sts.notes, sts.geog, sts.altitude,
    clu.collectionunitid, clu.collunitname, clu.handle, cts.colltype
ORDER BY sts.siteid, clu.collectionunitid;