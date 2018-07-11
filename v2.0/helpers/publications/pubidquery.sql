SELECT * FROM 
          ndb.publications AS pub 
INNER JOIN
    ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid 
INNER JOIN 
    ndb.contacts as ca ON ca.contactid = pa.contactid 
WHERE
  (${pubid} IS NULL OR pub.pubid = ${pubid})
