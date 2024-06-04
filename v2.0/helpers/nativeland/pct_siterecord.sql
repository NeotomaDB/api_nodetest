WITH sitemeta AS (
    SELECT sitename, datasetid, altitude, depenvt, geog FROM 
    ap.querytable AS qt
    WHERE datasettype = 'pollen')
SELECT sm.sitename, 
       sm.datasetid,
       sm.altitude,
       sm.depenvt,
       ST_AsText(sm.geog),
       age.age,
       age.ageolder,
       age.ageyounger,
       tx.taxonname AS variable,
       dt.value,
       vu.variableunits
FROM sitemeta AS sm
INNER JOIN da.vbestsampleages AS age ON sm.datasetid = age.datasetid
INNER JOIN ndb.data AS dt ON dt.sampleid = age.sampleid
INNER JOIN ndb.variables AS vr ON vr.variableid = dt.variableid
INNER JOIN ndb.variableunits AS vu ON vu.variableunitsid = vr.variableunitsid
INNER JOIN ndb.taxa AS tx ON tx.taxonid = vr.taxonid
LIMIT 50;
