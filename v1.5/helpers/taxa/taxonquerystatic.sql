SELECT DISTINCT taxa.taxonid,
       taxa.taxonname,
       taxa.taxoncode,
       taxa.author AS author,
       ecg.ecolgroups,
       taxa.highertaxonid,
       taxa.extinct,
       taxa.taxagroupid,
       taxa.notes,
       CASE WHEN taxa.extinct = false THEN 'extant'
            WHEN taxa.extinct = true THEN 'extinct'
       END AS status,
       taxa.publicationid AS publicationid,
       pub.citation AS publication
  FROM
  ndb.taxa AS taxa
  LEFT OUTER JOIN
  (SELECT
       eg.taxonid,
       array_agg(eg.ecolgroupid) AS ecolgroups
    FROM
    ndb.ecolgroups eg
    WHERE
    (${taxonid} IS NULL OR eg.taxonid IN (${taxonid:csv}))
    AND (${ecolgroup} IS NULL OR eg.ecolgroupid = ${ecolgroup})
    GROUP BY taxonid) ecg on ecg.taxonid = taxa.taxonid
  --ndb.ecolgroups AS ecg ON ecg.taxonid = taxa.taxonid
  LEFT OUTER JOIN
  ndb.publications AS pub ON pub.publicationid = taxa.publicationid
  LEFT OUTER JOIN 
  ndb.variables AS var ON var.taxonid = taxa.taxonid
  WHERE
  taxa.valid = true
  AND  (${taxonid} IS NULL OR taxa.taxonid IN (${taxonid:csv}))
  AND (${taxonname} IS NULL OR LOWER(taxa.taxonname) LIKE LOWER(${taxonname}))
  AND (${status} IS NULL OR taxa.extinct = ${status})
  AND (${taxagroup} IS NULL OR taxa.taxagroupid = ${taxagroup})



;