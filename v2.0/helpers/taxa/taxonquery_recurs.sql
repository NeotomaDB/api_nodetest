WITH RECURSIVE lowertaxa AS (SELECT
              txa.taxonid,
              txa.highertaxonid
         FROM ndb.taxa AS txa
        WHERE (${taxonid} IS NULL OR (txa.taxonid = ANY (${taxonid})))
        UNION ALL
       SELECT m.taxonid, m.highertaxonid
         FROM ndb.taxa AS m
         JOIN lowertaxa ON lowertaxa.taxonid = m.highertaxonid)
SELECT DISTINCT txa.taxonid,
       txa.taxonname,
       txa.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       txa.highertaxonid,
       CASE WHEN txa.extinct = false THEN 'extant'
            WHEN txa.extinct = true  THEN 'extinct'
       END AS status,
       txa.publicationid AS publicationid,
       pub.citation AS publication
FROM
  lowertaxa AS taxa
  LEFT OUTER JOIN ndb.taxa AS txa ON txa.taxonid = taxa.taxonid
  LEFT OUTER JOIN ndb.ecolgroups AS ecg ON ecg.taxonid = taxa.taxonid
  LEFT OUTER JOIN ndb.ecolgrouptypes AS ecgt ON ecgt.ecolgroupid = ecg.ecolgroupid
  INNER JOIN ndb.taxagrouptypes AS tgt ON tgt.taxagroupid = txa.taxagroupid
  LEFT OUTER JOIN ndb.publications AS pub ON pub.publicationid = txa.publicationid
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
                 ELSE ${offset}
            END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
      ELSE ${limit}
    END);
