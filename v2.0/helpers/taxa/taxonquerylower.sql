WITH RECURSIVE lowertaxa AS (SELECT
              txa.taxonid,
              txa.highertaxonid
         FROM ndb.taxa AS txa
        WHERE
          (${taxonname} IS NULL OR LOWER(txa.taxonname) LIKE ANY(${taxonname})) AND
          (${taxonid} IS NULL OR txa.taxonid = ANY (${taxonid}))
        UNION ALL
       SELECT m.taxonid, m.highertaxonid
         FROM ndb.taxa AS m
         JOIN lowertaxa ON lowertaxa.taxonid = m.highertaxonid)

SELECT txa.taxonid,
       txa.taxonname,
       txa.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       txa.highertaxonid,
       CASE WHEN txa.extinct = False THEN 'extant'
            WHEN txa.extinct = True THEN 'extinct'
       END AS status,
       txa.publicationid AS publicationid,
       pub.citation AS publication
  FROM
  lowertaxa AS taxa
  LEFT OUTER JOIN
  ndb.ecolgroups AS ecg ON ecg.taxonid = taxa.taxonid
  LEFT OUTER JOIN
  ndb.taxa AS txa ON txa.taxonid = taxa.taxonid
  LEFT OUTER JOIN
  ndb.publications AS pub ON pub.publicationid = txa.publicationid
  WHERE
WHERE
  ((${taxonid} IS NULL) OR txa.taxonid = ANY(${taxonid}))
  AND (${status} IS NULL OR txa.extinct = ${status})
  AND (${taxagroup} IS NULL OR tgt.taxagroup ILIKE ANY(${taxagroup}))
  AND (${ecolgroup} IS NULL OR ecgt.ecolgroup ILIKE ANY(${ecolgroup}))
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
                 ELSE ${offset}
            END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
      ELSE ${limit}
    END);