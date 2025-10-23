SELECT
jsonb_build_object(   'siteid', sp.siteid,
                       'collectionunitid', scu.collectionunitid,
                       'entityid', sp.entityid,
                       'entityname', sp.entityname,
                       'monitoring', sp.monitoring,
                       'rockageid', sp.rockageid, -- check if there is a rockageid
                       'entrancedistance', sp.entrancedistance,
                       'entrancedistanceunits', sp.entrancedistanceunits,
                       'speleothemtypeid', sp.speleothemtypeid) AS speleothem -- create a join to extract the type rather than just the id
FROM ndb.speleothems sp
LEFT JOIN ndb.speleothemcollectionunits scu
ON sp.entityid = scu.entityid
WHERE scu.collectionunitid IN ($1:csv);