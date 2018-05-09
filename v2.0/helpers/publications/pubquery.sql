SELECT * FROM 
  ndb.publications AS pub 
INNER JOIN
    ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid 
INNER JOIN 
    ndb.contacts as ca ON ca.contactid = pa.contactid 
WHERE
  (${pubid} IS NULL OR pub.publicationid = ${pubid})
  AND (${familyname} IS NULL OR ca.familyname LIKE ${familyname})
  AND (${year} IS NULL OR pub.year = ${year})
