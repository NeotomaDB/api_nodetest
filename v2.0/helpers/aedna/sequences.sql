WITH RECURSIVE taxon_climb AS (
    SELECT DISTINCT
        am.taxonid AS base_taxonid,
        t.taxonid,
        t.taxonname,
        t.highertaxonid,
        1 AS level
    FROM ndb.sequences sq
    INNER JOIN ndb.aednamodels am ON am.sequenceid = sq.sequenceid
    INNER JOIN ndb.taxa t ON t.taxonid = am.taxonid
    WHERE sq.datasetid = ${datasetid}
      AND am.supersededbymodelid IS NULL

    UNION ALL

    SELECT
        tc.base_taxonid,
        t.taxonid,
        t.taxonname,
        t.highertaxonid,
        tc.level + 1
    FROM ndb.taxa t
    INNER JOIN taxon_climb tc ON t.taxonid = tc.highertaxonid
    WHERE tc.highertaxonid IS NOT NULL
      AND tc.highertaxonid <> tc.taxonid
),
taxon_chains AS (
    SELECT
        base_taxonid,
        jsonb_agg(taxonname ORDER BY level DESC) AS taxonchain
    FROM taxon_climb
    GROUP BY base_taxonid
),
sequence_details AS (
    SELECT
        sq.sequenceid,
        sq.sequence,
        sq.primername,
        am.taxonid,
        am.model,
        pb.doi AS publicationdoi
    FROM ndb.sequences sq
    INNER JOIN ndb.aednamodels am ON am.sequenceid = sq.sequenceid
    LEFT JOIN ndb.publications pb ON pb.publicationid = am.publicationid
    WHERE sq.datasetid = ${datasetid}
      AND am.supersededbymodelid IS NULL
)
SELECT json_build_object(
    'datasetid', ${datasetid},
    'sequences', COALESCE(json_agg(
        json_build_object(
            'taxonid', g.taxonid,
            'taxonname', g.taxonname,
            'taxonchain', g.taxonchain,
            'sequences', g.seqs
        )
    ), '[]'::json)
) AS result
FROM (
    SELECT
        sd.taxonid,
        tx.taxonname,
        tc.taxonchain,
        json_agg(
            json_build_object(
                'sequenceid', sd.sequenceid,
                'sequence', sd.sequence,
                'model', sd.model,
                'primername', sd.primername,
                'publicationdoi', sd.publicationdoi
            )
        ) AS seqs
    FROM sequence_details sd
    INNER JOIN ndb.taxa tx ON tx.taxonid = sd.taxonid
    LEFT JOIN taxon_chains tc ON tc.base_taxonid = sd.taxonid
    GROUP BY sd.taxonid, tx.taxonname, tc.taxonchain
) AS g;
