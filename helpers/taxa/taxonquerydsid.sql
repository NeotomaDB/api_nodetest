SELECT DISTINCT tx.taxonid,
       tx.taxonname,
       tx.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       CASE WHEN tx.extinct = 0 THEN 'extant'
            WHEN tx.extinct = 1 THEN 'extinct'
       END AS status,
       tx.publicationid AS publicationid,
       pub.citation AS publication
  FROM
  ndb.dslinks AS ds
  LEFT OUTER JOIN ndb.samples AS samples ON samples.datasetid = ds.datasetid 
  LEFT OUTER JOIN ndb.data AS data ON samples.sampleid = data.sampleid
  LEFT OUTER JOIN ndb.variables AS var ON data.variableid = var.variableid
  LEFT OUTER JOIN ndb.taxa AS tx on var.taxonid = tx.taxonid
  LEFT OUTER JOIN ndb.ecolgroups AS ecg ON ecg.taxonid = tx.taxonid
  LEFT OUTER JOIN ndb.publications AS pub ON pub.publicationid = tx.publicationid
  WHERE ds.datasetid IN ($1:csv)
  OFFSET (CASE WHEN ${offset} IS NULL THEN 0
              ELSE ${offset}
         END)
  LIMIT (CASE WHEN ${limit} IS NULL THEN 25
              ELSE ${limit}
         END);