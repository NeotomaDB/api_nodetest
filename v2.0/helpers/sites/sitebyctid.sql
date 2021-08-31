SELECT ct.contactid,
       ct.contactname,
       jsonb_build_object('siteid', sts.siteid, 
                          'sitename', sts.sitename, 
                          'sitedescription', sts.sitedescription,
                          'geography', ST_AsGeoJSON(sts.geog,5,2),
                          'altitude', sts.altitude, 
  	                      'collectionunits', bigq.collectionunit) AS sites
FROM ap.querytable AS bigq
  INNER JOIN ndb.sites AS  sts ON sts.siteid = bigq.siteid  
  LEFT OUTER JOIN ndb.contacts AS ct ON ct.contactid = ANY(bigq.contacts)
WHERE ct.contactid = ANY($1)
GROUP BY ct.contactid, sts.siteid, bigq.collectionunit;
