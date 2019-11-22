SELECT DISTINCT
       ecg.taxonid,
       array_agg(ecg.ecolgroupid) AS ecolgroup,
  FROM
  ndb.ecolgroups ecg
  WHERE
  (${taxonid} IS NULL OR ecg.taxonid IN (${taxonid:csv}))
  AND (${ecolgroupid} IS NULL OR ecg.ecolgroupid = ${ecolgroupid})
  GROUP BY taxonid

/*example
--27884

SELECT 
       ecg.taxonid,
       array_agg(ecg.ecolgroupid) AS ecolgroup
  FROM
  ndb.ecolgroups ecg
  WHERE
  ((27884,34531,18702) IS NULL OR ecg.taxonid IN (27884,34531,18702))
  AND (NULL IS NULL OR ecg.ecolgroupid = 'NODATA')
  GROUP BY taxonid

  */