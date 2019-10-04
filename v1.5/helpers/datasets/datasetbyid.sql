SELECT 
    json_build_object(       'siteid', sts.siteid, 
                              'sitename', sts.sitename,
                       'sitedescription', sts.sitedescription,
                             'sitenotes', sts.notes,
                             'geography', ST_AsGeoJSON(sts.geog,5,2),
                         'latitudesouth', ST_YMIN(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                         'latitudenorth', ST_YMax(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                         'longitudeeast', ST_XMax(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                         'longitudewest', ST_XMin(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                              'altitude', sts.altitude, 
                              'unittype', cts.colltype) as site,
                 json_agg(
                          json_build_object(
                             'contactid', cntct.contactid,
                           'contactname', cntct.contactname
                        )) as datasetpis,
                 json_agg(
                      json_build_object(
                        'submissiondate', dtssubs.submissiondate,
                        'submissiontype', dtssubtp.submissiontype
                          )) as subdates,       
                           dsa.ageoldest,
                         dsa.ageyoungest,
                        clu.collunitname,
                              clu.handle as "collunithandle",
                    clu.collectionunitid,
                            cts.colltype as "collunittype",
                         dts.datasetname as "datasetname",
                           dts.datasetid as "datasetid",
                         dst.datasettype,
                               dts.notes as "datasetnotes",
                      cstdb.databasename,
                                 doi.doi
                                   FROM
ndb.datasets AS dts LEFT OUTER JOIN
da.vbestdatasetages AS dsa ON dsa.datasetid = dts.datasetid LEFT OUTER JOIN
ndb.datasetsubmissions AS dtssubs ON dtssubs.datasetid = dts.datasetid LEFT OUTER JOIN
ndb.datasetsubmissiontypes AS dtssubtp ON dtssubtp.submissiontypeid = dtssubs.submissiontypeid LEFT OUTER JOIN
ndb.datasetpis as dtspis ON dtspis.datasetid = dts.datasetid LEFT OUTER JOIN
ndb.contacts as cntct ON cntct.contactid = dtspis.contactid LEFT OUTER JOIN
ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid LEFT OUTER JOIN
ndb.sites AS sts ON sts.siteid = clu.siteid  LEFT OUTER JOIN
ndb.datasettypes AS dst ON dst.datasettypeid = dts.datasettypeid LEFT OUTER JOIN
ndb.datasetdoi AS doi ON dts.datasetid = doi.datasetid LEFT OUTER JOIN
ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
ndb.datasetdatabases AS dsdb ON dsdb.datasetid = dts.datasetid LEFT OUTER JOIN
ndb.constituentdatabases AS cstdb ON dsdb.databaseid = cstdb.databaseid 
WHERE dts.datasetid IN ($1:csv)
GROUP BY sts.siteid, clu.collectionunitid, cts.colltype, 
dts.datasetname, dts.datasetid, dst.datasettype,cstdb.databasename,
doi.doi,dsa.ageoldest,dsa.ageyoungest;