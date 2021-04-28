SELECT json_build_object(       'siteid', sts.siteid,
                              'sitename', sts.sitename,
                       'sitedescription', sts.sitedescription,
                             'sitenotes', sts.notes,
                             'geography', ST_AsGeoJSON(sts.geog,5,2),
                              'altitude', sts.altitude,
                      'collectionunitid', clu.collectionunitid,
                        'collectionunit', clu.collunitname,
                                'handle', clu.handle,
                              'unittype', cts.colltype) as site,
       json_agg(
              json_build_object(  'datasetid', dts.datasetid,
                                'datasettype', dst.datasettype,
                                'datasetnotes', dts.notes,
                                'database', cstdb.databasename,
                                        'doi', doi.doi,
                                 'datasetpi', json_build_object('contactid', cnt.contactid,
                                                                'contactname', cnt.contactname,
                                                                'familyname', cnt.familyname,
                                                                'firstname', cnt.givennames,
                                                                'initials', cnt.leadinginitials))) AS dataset FROM
ndb.datasets AS dts LEFT OUTER JOIN
ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid LEFT OUTER JOIN
ndb.sites AS sts ON sts.siteid = clu.siteid  LEFT OUTER JOIN
ndb.datasettypes AS dst ON dst.datasettypeid = dts.datasettypeid LEFT OUTER JOIN
ndb.datasetdoi AS doi ON dts.datasetid = doi.datasetid LEFT OUTER JOIN
ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
ndb.datasetdatabases AS dsdb ON dsdb.datasetid = dts.datasetid LEFT OUTER JOIN
ndb.datasetpis AS dspi ON dspi.datasetid = dts.datasetid LEFT OUTER JOIN
ndb.contacts AS cnt ON cnt.contactid = dspi.contactid LEFT OUTER JOIN
ndb.constituentdatabases AS cstdb ON dsdb.databaseid = cstdb.databaseid
WHERE
(${siteid} IS NULL OR sts.siteid LIKE ${siteid}) AND
(${datasettype} IS NULL OR dst.datasettype LIKE ${datasettype}) AND
(${datasetid} IS NULL OR dst.datasetid IN (${datasetid}:csv)) AND
(${piid} IS NULL OR cnt.contactid IN (${piid}:csv)) AND
(${altmin} IS NULL OR sts.altitude > ${altmin}) AND
(${altmax} IS NULL OR sts.altitude > ${altmax}) AND
(${loc} IS NULL OR st_contains(ST_GeomFromText(${loc}), sts.geog))
# gpid  Geopolitical entity id in which the datasets occur; see below.
# taxonids  Unique database record identifier for a taxon; accepts one or more ids separated by commas.
#taxonname Name or partial name of the taxon/taxa.
#ageold  Oldest age, as calendar years before present, to include in results.
#ageyoung  Youngest age, as calendar years before present, to include in results.
#ageof Indicates to which elements of a dataset search ages should apply; see below.
#subdate Return datasets submitted on or after a specified date. Format dates as YYYY-MM-DD or MM-DD-YYYY.

GROUP BY sts.siteid, clu.collectionunitid, cts.colltype;
