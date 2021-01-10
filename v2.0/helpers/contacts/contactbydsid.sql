SELECT
  jsonb_build_object('datasetid', dspi.datasetid,
    'contacts', json_agg(json_build_object('contactid', cnt.contactid,
			                        'fullname', cnt.contactname,
		                          'lastname', cnt.familyname,
			                       'firstname', cnt.givennames,
                                   'url', cnt.url,
                                 'email', cnt.email,
                               'address', cnt.address))) AS contacts
FROM
  ndb.contacts AS cnt LEFT OUTER JOIN
  ndb.datasetpis AS dspi ON cnt.contactid = dspi.contactid
WHERE dspi.datasetid IN ($1:csv)
GROUP BY dspi.datasetid;
