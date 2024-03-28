SELECT COUNT(*), to_char(DATE_TRUNC('MONTH', ds.recdatecreated), 'YYYY/MM/DD') as month
FROM ndb.datasets AS ds
INNER JOIN ndb.datasetdatabases AS dsdb ON dsdb.datasetid = ds.datasetid
WHERE dsdb.databaseid = ${dbid}
GROUP BY to_char(DATE_TRUNC('MONTH', ds.recdatecreated), 'YYYY/MM/DD')
ORDER BY to_char(DATE_TRUNC('MONTH', ds.recdatecreated), 'YYYY/MM/DD') ASC;