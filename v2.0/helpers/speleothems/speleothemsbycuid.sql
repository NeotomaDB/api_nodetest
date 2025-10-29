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
    SELECT g.entityid, ra.rocktype
    FROM ndb.entitygeology g
    LEFT JOIN ndb.rocktypes ra ON g.speleothemgeologyid = ra.rocktypeid
),
rockage AS (
    SELECT sp.entityid, sp.rockageid, ra.relativeage
    FROM ndb.speleothems sp
    LEFT JOIN ndb.relativeages ra ON sp.rockageid = ra.relativeageid
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
SELECT  DISTINCT
jsonb_build_object(   'siteid', sp.siteid,
                       'collectionunitid', scu.collectionunitid,
                       'entityid', sp.entityid,
                       'entityname', sp.entityname,
                       'speleothemtype', st.speleothemtype,
                       'speleothemdriptype', sdt.speleothemdriptype,
                       'dripheight', sdt.entitydripheight,
                       'dripheightunits', sdt.dripheightunits,
                       'entitycovertype', ec.entitycovertype,
                       'entitycoverthickness', ec.entitycoverthickness,
                       'rockage', ra.relativeage,
                       'geology', g.rocktype,
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
LEFT JOIN ndb.datasettypes dt ON dt.datasettypeid = ds.datasettypeid
LEFT JOIN dist_units du ON du.entityid = sp.entityid
LEFT JOIN speleothem_type st ON st.entityid = sp.entityid
LEFT JOIN speleothem_dt sdt ON sdt.entityid = sp.entityid
LEFT JOIN entitycovers ec ON ec.entityid = sp.entityid
LEFT JOIN rockage ra ON ra.entityid = sp.entityid
LEFT JOIN geology g ON g.entityid = sp.entityid
LEFT JOIN landusecover luc ON luc.entityid = sp.entityid
LEFT JOIN vegetationcovertypes vct ON vct.entityid = sp.entityid
WHERE cu.collectionunitid IN ($1:csv) AND dt.datasettypeid = 44;