SELECT DISTINCT pub.* FROM
  ndb.publications AS pub
INNER JOIN
     ndb.publicationauthors AS pa  ON pub.publicationid = pa.publicationid
INNER JOIN
               ndb.contacts AS ca  ON      ca.contactid = pa.contactid
LEFT JOIN
    ndb.datasetpublications AS dp  ON  dp.publicationid = pub.publicationid
INNER JOIN
	     ndb.publicationtypes AS pt  ON     pub.pubtypeid = pt.pubtypeid
WHERE
  (${pubid}      IS NULL OR pub.publicationid = ANY (${pubid}::int[]))     AND
  (${datasetid}  IS NULL OR      dp.datasetid = ANY (${datasetid})) AND
  (${familyname} IS NULL OR     ca.familyname LIKE  ${familyname})  AND
  (${pubtype}    IS NULL OR        pt.pubtype =     ${pubtype})     AND
  (${year}       IS NULL OR          pub.year =     ${year})        AND
  (${search}     IS NULL OR      pub.citation SIMILAR TO (${search}))
