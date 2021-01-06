SELECT json_build_object(       'datasetid', ds.datasetid, 
                              'recdatecreated', ds.recdatecreated,
                              'datasettype', dst.datasettype,
                             'databasename', cdb.databasename,
                             'sitename', st.sitename,
                              'geo', string_agg(distinct gpu.geopoliticalname, ' | ')) as record
FROM ndb.datasets AS ds
INNER JOIN ndb.datasettypes AS dst ON ds.datasettypeid = dst.datasettypeid
INNER JOIN	 ndb.datasetdatabases AS dsdb ON ds.datasetid = dsdb.datasetid 
INNER JOIN	 ndb.constituentdatabases AS cdb ON dsdb.databaseid = cdb.databaseid
INNER JOIN	 ndb.collectionunits AS cu ON ds.collectionunitid = cu.collectionunitid
INNER JOIN	 ndb.sites AS st ON cu.siteid = st.siteid 
INNER JOIN	 ndb.sitegeopolitical AS sgp ON st.siteid = sgp.siteid
INNER JOIN	 ndb.geopoliticalunits AS gpu ON sgp.geopoliticalid = gpu.geopoliticalid
where ds.recdatecreated BETWEEN date_trunc('month', current_date - ($1 * interval '1 month')) AND date_trunc('month', current_date) 
group by ds.datasetid, 
         dst.datasettype, 
		 cdb.databasename, 
		 st.sitename
ORDER BY ds.recdatecreated DESC;
