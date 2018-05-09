WITH stpub AS 
  (SELECT publicationid FROM 
  	ndb.datasetpublications as dp
  	INNER JOIN
  	ndb.dslinks AS sts
  	ON sts.datasetid = dp.datasetid
    WHERE ($1 IS NULL OR sts.siteid IN ($1:csv)))
SELECT * FROM 
          ndb.publications AS pub 
  INNER JOIN
    ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid 
  INNER JOIN 
    ndb.contacts as ca ON ca.contactid = pa.contactid 
WHERE pub.publicationid IN (SELECT publicationid FROM stpub)