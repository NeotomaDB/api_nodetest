SELECT
  json_agg(json_build_object('contactid', cnt.contactid,
			                  'fullName', cnt.contactname,
		                      'lastName', cnt.familyname,
			                 'firstName', cnt.givennames,
                                   'url', cnt.url,
                                   'email', cnt.email,
                               'address', cnt.address)) AS contact,
  dspi.datasetid as datasetid
FROM
  ndb.contacts AS cnt LEFT OUTER JOIN
  ndb.datasetpis AS dspi ON cnt.contactid = dspi.contactid
WHERE dspi.datasetid IN ($1:csv)
GROUP BY dspi.datasetid;
