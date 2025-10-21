WITH dist_units AS (
    SELECT sp.entityid, vu.variableunits
    FROM ndb.speleothems sp
    LEFT JOIN ndb.variableunits vu ON sp.entrancedistanceunits = vu.variableunitsid
),
speleothem_type AS (
    SELECT sp.entityid, st.speleothemtype
    FROM ndb.speleothems sp
    LEFT JOIN ndb.speleothemtypes st ON sp.speleothemtypeid = st.speleothemtypeid
),
speleothem_dt AS (
    SELECT en.entityid, dt.speleothemdriptype, en.entitydripheight, vu.variableunits AS dripheightunits
    FROM ndb.entitydripheight en
    LEFT JOIN ndb.speleothemdriptypes dt ON en.speleothemdriptypeid = dt.speleothemdriptypeid
    LEFT JOIN ndb.variableunits vu ON en.entitydripheightunit = vu.variableunitsid
),
entitycovers AS (
    SELECT ec.entityid, ect.entitycovertype, ec.entitycoverthickness
    FROM ndb.entitycovers ec
    LEFT JOIN ndb.entitycovertypes ect ON ec.entitycoverid = ect.entitycoverid
),
geology AS (
    SELECT g.entityid, ra.relativeage
    FROM ndb.entitygeology g
    LEFT JOIN ndb.relativeages ra ON g.speleothemgeologyid = ra.relativeageid
),
landusecover AS (
    SELECT luc.entityid, vct.vegetationcovertype, luc.landusecoverpercent
    FROM ndb.entitylandusecover luc
    LEFT JOIN ndb.vegetationcovertypes vct ON luc.landusecovertypeid = vct.vegetationcovertypeid
),
vegetationcovertypes AS (
    SELECT evc.entityid, vct.vegetationcovertype, evc.vegetationcoverpercent
    FROM ndb.entityvegetationcover evc
    LEFT JOIN ndb.vegetationcovertypes vct ON evc.vegetationcovertypeid = vct.vegetationcovertypeid
)
SELECT  
jsonb_build_object(   'siteid', sp.siteid,
                       'collectionunitid', scu.collectionunitid,
                       'datasetid', ds.datasetid,
                       'entityid', sp.entityid,
                       'entityname', sp.entityname,
                       'speleothemtype', st.speleothemtype,
                       'speleothemdriptype', sdt.speleothemdriptype,
                       'dripheight', sdt.entitydripheight,
                       'dripheightunits', sdt.dripheightunits,
                       'entitycovertype', ec.entitycovertype,
                       'entitycoverthickness', ec.entitycoverthickness,
                       'relativeage', g.relativeage,
                       'vegetationcovertype', vct.vegetationcovertype,
                       'vegetationcoverpercent', vct.vegetationcoverpercent,
                       'landusecovertype', luc.vegetationcovertype,
                       'landusecoverpercent', luc.landusecoverpercent,
                       'monitoring', sp.monitoring,
                       'entrancedistance', sp.entrancedistance,
                       'entrancedistanceunits', sp.entrancedistanceunits) AS speleothem
FROM ndb.speleothems sp
LEFT JOIN ndb.speleothemcollectionunits scu ON scu.entityid = sp.entityid
LEFT JOIN ndb.collectionunits cu ON scu.collectionunitid = cu.collectionunitid
LEFT JOIN ndb.datasets ds ON cu.collectionunitid = ds.collectionunitid
LEFT JOIN dist_units du ON du.entityid = sp.entityid
LEFT JOIN speleothem_type st ON st.entityid = sp.entityid
LEFT JOIN speleothem_dt sdt ON sdt.entityid = sp.entityid
LEFT JOIN entitycovers ec ON ec.entityid = sp.entityid
LEFT JOIN geology g ON g.entityid = sp.entityid
LEFT JOIN landusecover luc ON luc.entityid = sp.entityid
LEFT JOIN vegetationcovertypes vct ON vct.entityid = sp.entityid
WHERE ds.datasetid IN ($1:csv);
