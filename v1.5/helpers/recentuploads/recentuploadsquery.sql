SELECT json_build_object(       'datasetid', datasets.datasetid, 
                              'recdatecreated', datasets.recdatecreated,
                              'datasettype', datasettypes.datasettype,
                             'databasename', constituentdatabases.databasename,
                             'sitename', sites.sitename,
                              'geo', string_agg(distinct geopoliticalunits.geopoliticalname, ' | ')) as record
from ndb.datasets, ndb.datasettypes, ndb.constituentdatabases, ndb.datasetdatabases, ndb.collectionunits, ndb.sites, ndb.sitegeopolitical, ndb.geopoliticalunits
where datasets.recdatecreated >= date_trunc('month', current_date - interval '3 month') and
      datasets.recdatecreated < date_trunc('month', current_date) and
	datasets.datasettypeid = datasettypes.datasettypeid and
	datasets.datasetid = datasetdatabases.datasetid and
	datasetdatabases.databaseid = constituentdatabases.databaseid and
      ndb.datasets.collectionunitid = ndb.collectionunits.collectionunitid and
      ndb.collectionunits.siteid = ndb.sites.siteid and
      ndb.sites.siteid = ndb.sitegeopolitical.siteid and
      ndb.sitegeopolitical.geopoliticalid = ndb.geopoliticalunits.geopoliticalid
group by datasets.datasetid, datasets.recdatecreated, datasettypes.datasettype, constituentdatabases.databasename, sites.sitename;