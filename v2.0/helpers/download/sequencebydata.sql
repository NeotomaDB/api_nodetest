SELECT sd.dataid, sd.sequenceid, sq.sequence
FROM ndb.sequencedata sd
INNER JOIN ndb.sequences sq ON sq.sequenceid = sd.sequenceid
WHERE sd.dataid = ANY(${dataids});
