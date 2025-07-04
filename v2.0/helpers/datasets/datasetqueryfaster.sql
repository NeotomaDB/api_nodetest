WITH filtered_datasets AS (
    SELECT DISTINCT bigq.siteid, bigq.datasetid
    FROM ap.querytable AS bigq
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
        AND (${datasettype} IS NULL OR bigq.datasettype LIKE ${datasettype})
        AND (${doi} IS NULL OR dsdoi.doi = ANY(${doi}))
        AND (${gpid} IS NULL OR bigq.geopol && ${gpid})
        AND (${keywords} IS NULL OR bigq.keywords && ${keywords})
        AND (${loc} IS NULL OR NOT ST_Disjoint(ST_GeogFromText(${loc})::geometry, bigq.geog::geometry))
        AND (${maxage} IS NULL OR ${maxage} >= bigq.younger)
        AND (${minage} IS NULL OR ${minage} <= bigq.older)
        AND (${siteid} IS NULL OR bigq.siteid = ANY(${siteid}))
        AND (${taxa} IS NULL OR bigq.taxa && ${taxa})
    ORDER BY bigq.siteid, bigq.datasetid
    -- This is cheating a bit. We're querying a smaller chunk here and hoping that taking 3 times the datasets is enough
    -- to get us the actual limit.
    LIMIT COALESCE(${limit}, 25) * 3
    OFFSET COALESCE(${offset}, 0)
),
-- Now these CTEs work on a much smaller dataset
dataset_dois AS (
    SELECT 
        ddoi.datasetid,
        json_agg(DISTINCT ddoi.doi) as dois
    FROM ndb.datasetdoi ddoi
    WHERE ddoi.datasetid IN (SELECT datasetid FROM filtered_datasets)
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
    WHERE dspi.datasetid IN (SELECT datasetid FROM filtered_datasets)
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
        WHERE smp.datasetid IN (SELECT datasetid FROM filtered_datasets)
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
            'datasetpi', COALESCE(dpis.pis, '[]'::json),
            'agerange', COALESCE(dage.ageranges, '[]'::json)
        )
    )
) as site
FROM filtered_datasets fds
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
ORDER BY sts.siteid, clu.collectionunitid
LIMIT COALESCE(${limit}, 25)
OFFSET COALESCE(${offset}, 0);