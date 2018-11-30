SELECT DISTINCT taxa.taxonid,
       taxa.taxonname,
       taxa.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       taxa.taxagroupid AS taxagroup,
       taxa.highertaxonid,
       CASE WHEN taxa.extinct = false THEN 'extant'
            WHEN taxa.extinct = true THEN 'extinct'
       END AS status,
       taxa.publicationid AS publicationid,
       pub.citation AS publication
  FROM
  ndb.taxa AS taxa
  LEFT OUTER JOIN
  ndb.ecolgroups AS ecg ON ecg.taxonid = taxa.taxonid
  LEFT OUTER JOIN
  ndb.publications AS pub ON pub.publicationid = taxa.publicationid
  LEFT OUTER JOIN
  ndb.taxagrouptypes AS tgt ON tgt.taxagroupid = taxa.taxagroupid
  LEFT OUTER JOIN
  ndb.variables AS var ON var.taxonid = taxa.taxonid
  WHERE
  (${taxonid} IS NULL OR taxa.taxonid = ANY (${taxonid}))
  AND (${taxonname} IS NULL OR LOWER(taxa.taxonname) LIKE ANY (${taxonname}::varchar[]))
  AND (${status} IS NULL OR taxa.extinct = ${status})
  AND (${taxagroup} IS NULL OR LOWER(tgt.taxagroup) LIKE ANY(${taxagroup}::varchar[]))
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
