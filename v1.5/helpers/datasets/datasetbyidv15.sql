/*
{
  "success": 1,
  "data": [{
    "DatabaseName": "North American Pollen Database",
    "DOI": null,
    "AgeOldest": 48642.0,
    "CollUnitName": null,
    "CollUnitHandle": "LKANNIE",
    "Site": {
      "LongitudeWest": -81.35466,
      "SiteID": 1597,
      "SiteName": "Lake Annie",
      "Altitude": 34.0,
      "LongitudeEast": -81.34709,
      "SiteDescription": "Sinkhole lake on the Lake Wales Ridge. Located at the Archbold Biological Stattion. Upland vegetation Southern Ridge Sandhill, slash pine (Pinus elliottii)/wiregrass variant; Sand Pine Scrub, dominated by Pinus clausa, Quercus spp., and Lyonia; Oak Hickory Scrub (Carya floridana, Quercus spp.), and Rosemary Scrub (Ceratiola ericoides). Bayhead vegetation occurs south of the lake.",
      "LatitudeNorth": 27.21035,
      "LatitudeSouth": 27.20427,
      "SiteNotes": null
    },
    "DatasetName": null,
    "DatasetType": "pollen",
    "DatasetID": 1648,
    "SubDates": [{
      "SubmissionDate": null,
      "SubmissionType": "Compilation into a flat file database"
    }, {
      "SubmissionDate": "1991-04-09",
      "SubmissionType": "Compilation into a another relational database"
    }, {
      "SubmissionDate": "2007-06-30",
      "SubmissionType": "Compilation into Neotoma from another database"
    }],
    "CollectionUnitID": 1596,
    "AgeYoungest": 0.0,
    "CollUnitType": "Core",
    "DatasetPIs": [{
      "ContactID": 106,
      "ContactName": "Watts, William A."
    }]
  }]
}


   x d.datasetid,
   x ddoi.doi,
   x d.datasetname,
   x cu.collectionunitid,
   x cu.handle AS collunithandle,
   x cu.collunitname,
   x dst.datasettype,
   x ct.colltype,
    s.siteid,
    s.altitude,
    s.latitudesouth,
    s.longitudewest,
    s.latitudenorth,
    s.longitudeeast,
    dpi.contactid,
    dsa.minage,
    dsa.maxage,
    dsa.ageyoungest,
    dsa.ageoldest,
    constituentdatabases.databasename,
    s.geog

*/





SELECT json_build_object(       'siteid', sts.siteid, 
                              'sitename', sts.sitename,
                       'sitedescription', sts.sitedescription,
                             'sitenotes', sts.notes,
                             'latitudesouth', ST_YMIN(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                             'latitudenorth', ST_YMax(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                             'longitudeeast', ST_XMax(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                             'longitudewest', ST_XMin(ST_GeomFromText(ST_AsText(sts.geog),4326)),
                              'altitude', sts.altitude, 
                      'collectionunitid', clu.collectionunitid,
                        'collectionunit', clu.collunitname,
                                'handle', clu.handle,
                              'unittype', cts.colltype) as site,
                             'datasetid', dts.datasetid,
                           'datasettype', dst.datasettype,
                          'datasetnotes', dts.notes,
                          'databasename', cstdb.databasename,
                                   'doi', doi.doi,
                                   'ageoldest', dsa.ageoldest,
                                   'ageyoungest', dsa.ageyoungest,
                            'datasetpis', json_build_object('contactid', cnt.contactid, 
                                                                'contactname', cnt.contactname,
                                                                'familyname', cnt.familyname,
                                                                'firstname', cnt.givennames,
                                                                'initials', cnt.leadinginitials)
                                 AS dataset 
FROM
  ndb.datasets AS dts LEFT OUTER JOIN
  ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid LEFT OUTER JOIN
  ndb.sites AS sts ON sts.siteid = clu.siteid  LEFT OUTER JOIN
  ndb.datasettypes AS dst ON dst.datasettypeid = dts.datasettypeid LEFT OUTER JOIN
  ndb.datasetdoi AS doi ON dts.datasetid = doi.datasetid LEFT OUTER JOIN
  ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid LEFT OUTER JOIN
  ndb.datasetdatabases AS dsdb ON dsdb.datasetid = dts.datasetid LEFT OUTER JOIN
  ndb.datasetpis AS dspi ON dspi.datasetid = dts.datasetid LEFT OUTER JOIN
  ndb.contacts AS cnt ON cnt.contactid = dspi.contactid LEFT OUTER JOIN
  ndb.constituentdatabases AS cstdb ON dsdb.databaseid = cstdb.databaseid LEFT JOIN 
  da.vbestdatasetages dsa ON dts.datasetid = dsa.datasetid
WHERE
  dts.datasetid = $1
--GROUP BY sts.siteid, clu.collectionunitid, cts.colltype;



