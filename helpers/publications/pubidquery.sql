WITH dpub AS 
  (SELECT * FROM 
  	ndb.datasetpublications as dp 
    WHERE ($1 IS NULL OR dp.datasetid IN ($1:csv)))
SELECT * FROM 
          ndb.publications AS pub 
  INNER JOIN
    ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid 
  INNER JOIN 
    ndb.contacts as ca ON ca.contactid = pa.contactid 
WHERE pub.publicationid IN (SELECT publicationid FROM dpub)