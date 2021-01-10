WITH RECURSIVE lowertaxa AS (SELECT
              txa.taxonid,
              txa.highertaxonid
         FROM ndb.taxa AS txa
        WHERE txa.taxonid = ANY (${taxonid})
        UNION ALL
       SELECT m.taxonid, m.highertaxonid
         FROM ndb.taxa AS m
         JOIN lowertaxa ON lowertaxa.taxonid = m.highertaxonid)

SELECT txa.taxonid,
       txa.taxonname,
       txa.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       txa.highertaxonid,  lowertaxa AS taxa
       CASE WHEN txa.extinct = false THEN 'extant'
            WHEN txa.extinct = true  THEN 'extinct'
       END AS status,
       txa.publicationid AS publicationid,
       pub.citation AS publication
FROM
  lowertaxa AS taxa
  LEFT OUTER JOIN ndb.ecolgroups AS ecg ON ecg.taxonid = taxa.taxonid
  LEFT OUTER JOIN ndb.ecolgrouptypes AS ecgt ON ecgt.ecolgroupid = ecg.ecolgroupid
  LEFT OUTER JOIN ndb.taxagrouptypes AS tgt ON tgt.taxagroupid = txa.taxagroupid
  LEFT OUTER JOIN ndb.taxa AS txa ON txa.taxonid = taxa.taxonid
  LEFT OUTER JOIN ndb.publications AS pub ON pub.publicationid = txa.publicationid
WHERE
  (${taxonname} IS NULL OR txa.taxonname LIKE ${taxonname})
  AND (${status} IS NULL OR txa.extinct = ${status})
  AND (${taxagroup} IS NULL OR tgt.taxagroup = ANY(${taxagroup}))
  AND (${ecolgroup} IS NULL OR ecgt.ecolgroup = ANY(${ecolgroup}));
