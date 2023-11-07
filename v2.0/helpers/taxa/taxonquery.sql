SELECT DISTINCT txa.taxonid,
       txa.taxoncode,
       txa.taxonname,
       txa.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       txa.highertaxonid,
       CASE WHEN txa.extinct = false THEN 'extant'
            WHEN txa.extinct = true  THEN 'extinct'
       txa.taxagroupid,
       END AS status,
       txa.publicationid AS publicationid,
       pub.citation AS publication
FROM
  ndb.taxa AS txa
  LEFT OUTER JOIN ndb.ecolgroups AS ecg ON ecg.taxonid = txa.taxonid
  LEFT OUTER JOIN ndb.ecolgrouptypes AS ecgt ON ecgt.ecolgroupid = ecg.ecolgroupid
  INNER JOIN ndb.taxagrouptypes AS tgt ON tgt.taxagroupid = txa.taxagroupid
  LEFT OUTER JOIN ndb.publications AS pub ON pub.publicationid = txa.publicationid
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
