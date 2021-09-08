SELECT DISTINCT tx.taxonid,
       tx.taxonname,
       tx.author AS author,
       ecg.ecolgroupid AS ecolgroup,
       CASE WHEN tx.extinct = FALSE THEN 'extant'
            WHEN tx.extinct = TRUE THEN 'extinct'
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
  WHERE ds.datasetid = ANY ($1);