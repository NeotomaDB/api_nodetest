WITH investigator AS (
    SELECT
        ds.datasetid,
        dsp.piorder,
        CONCAT(cts.leadinginitials, ' ', cts.familyname) AS name
    FROM
        ndb.datasets AS ds
        INNER JOIN ndb.datasetpis AS dsp ON ds.datasetid = dsp.datasetid
        INNER JOIN ndb.contacts AS cts ON dsp.contactid = cts.contactid
),
investigators AS (
    SELECT
        investigator.datasetid,
        string_agg(
            investigator.name,
            ', '
            ORDER BY
                investigator.piorder ASC
        ) AS name
    FROM
        investigator
    GROUP BY
        investigator.datasetid
),
geopolitical AS (
    SELECT
        ds.datasetid,
        st.sitename,
        gpu.rank,
        gpu.geopoliticalname AS geoname
    FROM
        ndb.datasets AS ds
        INNER JOIN ndb.collectionunits AS cu ON ds.collectionunitid = cu.collectionunitid
        INNER JOIN ndb.sites AS st ON cu.siteid = st.siteid
        INNER JOIN ndb.sitegeopolitical AS sgp ON st.siteid = sgp.siteid
        INNER JOIN ndb.geopoliticalunits AS gpu ON sgp.geopoliticalid = gpu.geopoliticalid
    WHERE
        gpu.rank <= 3
),
geopoliticals AS (
    SELECT
        geopolitical.datasetid,
        string_agg(
            geopolitical.geoname,
            ' | '
            ORDER BY
                geopolitical.rank ASC
        ) AS geoname
    FROM
        geopolitical
    GROUP BY
        geopolitical.datasetid
)
SELECT
    json_build_object(
        'datasetid',
        ds.datasetid,
        'recdatecreated',
        ds.recdatecreated,
        'datasettype',
        dst.datasettype,
        'databasename',
        cdb.databasename,
        'investigator',
        inv.name,
        'sitename',
        geo.sitename,
        'geo',
        geos.geoname
    ) AS record
FROM
    ndb.datasets AS ds
    INNER JOIN ndb.datasettypes AS dst ON ds.datasettypeid = dst.datasettypeid
    INNER JOIN ndb.datasetdatabases AS dsdb ON ds.datasetid = dsdb.datasetid
    INNER JOIN investigators AS inv ON inv.datasetid = ds.datasetid
    INNER JOIN ndb.constituentdatabases AS cdb ON dsdb.databaseid = cdb.databaseid
    INNER JOIN geopolitical AS geo ON ds.datasetid = geo.datasetid
    INNER JOIN geopoliticals AS geos ON ds.datasetid = geos.datasetid
WHERE
    ds.recdatecreated BETWEEN date_trunc('month', current_date - $1 * INTERVAL '1 month')
    AND date_trunc('day', current_date + INTERVAL '1 day')
GROUP BY
    ds.datasetid,
    dst.datasettype,
    cdb.databasename,
    geo.sitename,
    inv.name,
    geos.geoname
ORDER BY
    ds.recdatecreated DESC;