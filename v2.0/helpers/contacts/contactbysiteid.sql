SELECT
  jsonb_build_object('siteid', dslinks.siteid,
    'contacts', json_agg(json_build_object('contactid', cnt.contactid,
                              'fullname', cnt.contactname,
                              'lastname', cnt.familyname,
                             'firstname', cnt.givennames,
                                   'url', cnt.url,
                                 'email', cnt.email,
                               'address', cnt.address))) AS contacts
FROM
  ndb.contacts AS cnt LEFT OUTER JOIN
  ndb.datasetpis AS dspi ON cnt.contactid = dspi.contactid LEFT OUTER JOIN
  ndb.dslinks AS dslinks ON dslinks.datasetid = dspi.datasetid
WHERE dslinks.siteid IN ($1:csv)
GROUP BY dslinks.siteid;
