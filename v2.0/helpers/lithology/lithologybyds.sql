SELECT ds.datasetid AS datasetid,
       json_agg(json_build_object('lithologyid', ly.lithologyid,
                                                                 'depth', json_build_object('top', ly.depthtop, 'bottom', ly.depthbottom),
                                                                 'lowerboundary', ly.lowerboundary,
                                                                 'description', ly.description)) AS lithology
FROM ndb.datasets AS ds 
INNER JOIN ndb.lithology AS ly ON ly.collectionunitid = ds.collectionunitid
WHERE ds.datasetid IN ($1:csv)
GROUP BY ds.datasetid