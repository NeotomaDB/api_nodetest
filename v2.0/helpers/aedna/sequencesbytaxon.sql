SELECT
  sq.sequenceid,
  sq.sequence,
  am.model,
  sq.primername,
  pb.doi AS publicationdoi
FROM ndb.aednamodels am
INNER JOIN ndb.sequences sq ON sq.sequenceid = am.sequenceid
LEFT JOIN ndb.publications pb ON pb.publicationid = am.publicationid
WHERE am.taxonid = ${taxonid}
  AND am.supersededbymodelid IS NULL
ORDER BY sq.sequenceid;
