SELECT DISTINCT pub.* FROM 
  ndb.publications AS pub 
INNER JOIN
    ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid
INNER JOIN 
    ndb.contacts as ca ON ca.contactid = pa.contactid 
INNER JOIN
    ndb.datasetpublications as dp ON dp.publicationid = pub.publicationid
INNER JOIN
    ndb.dslinks AS dsl ON dp.datasetid = dsl.datasetid
INNER JOIN
	ndb.publicationtypes AS pt ON pub.pubtypeid = pt.pubtypeid
WHERE
  (${pubid} IS NULL OR pub.publicationid = ANY (${pubid})) AND
  (${datasetid} IS NULL OR dp.datasetid = ANY (${datasetid})) AND
  (${familyname} IS NULL OR ca.familyname LIKE ${familyname}) AND
  (${pubtype} IS NULL OR pt.pubtype = ${pubtype}) AND
  (${year} IS NULL OR pub.year = ${year}) AND
  (${search} IS NULL OR pub.citation SIMILAR TO (${search}))
GROUP BY pub.publicationid