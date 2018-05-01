SELECT DISTINCT taxa.taxonid,
       taxa.taxonname,
       taxa.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       taxa.highertaxonid,
       CASE WHEN taxa.extinct = 0 THEN 'extant'
            WHEN taxa.extinct = 1 THEN 'extinct'
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
  ndb.variables AS var ON var.taxonid = taxa.taxonid
  WHERE
  (${taxonid} IS NULL OR taxa.taxonid IN (${taxonid:csv}))
  AND (${taxonname} IS NULL OR LOWER(taxa.taxonname) LIKE LOWER(${taxonname}))
  AND (${status} IS NULL OR taxa.extinct = ${status})
  AND (${taxagroup} IS NULL OR taxa.taxagroupid = ${taxagroup})
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);