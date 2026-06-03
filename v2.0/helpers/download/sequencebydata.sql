SELECT DISTINCT ON (sd.dataid) sd.dataid, sq.sequence
FROM ndb.sequencedata sd
INNER JOIN ndb.sequences sq ON sq.sequenceid = sd.sequenceid
WHERE sd.dataid = ANY(${dataids})
ORDER BY sd.dataid, sd.sequenceid DESC;
