SELECT
json_build_object('publicationid', pub.publicationid,
              'pubtypeid', pub.pubtypeid,
              'pubtype', pt.pubtype,
              'articletitle', pub.articletitle,
              'journal', pub.journal,
              'year' , pub.year,
              'booktitle' , pub.booktitle,
              'volume'  , pub.volume,
              'series'  , pub.seriestitle,
              'issue'   , pub.issue,
              'pages'   , pub.pages,
              'citation', pub.citation,
              'note' , pub.notes,
              'publisher' , pub.publisher,
              'edition'   , pub.edition,
              'city'      , pub.city,
              'country'   , pub.country,
              'doi'       , pub.doi,
              'author', json_agg(json_build_object('familyname', ca.familyname,
                                                   'givennames', ca.givennames,
                                                   'order', pa.authororder)),
              'datasets', COALESCE(json_agg(datasetid) FILTER (WHERE datasetid IS NOT NULL), '[]')) AS publication
FROM
  ndb.publications AS pub
INNER JOIN
     ndb.publicationauthors AS pa  ON pub.publicationid = pa.publicationid
INNER JOIN
               ndb.contacts AS ca  ON      ca.contactid = pa.contactid
LEFT JOIN ndb.datasetpublications AS dp ON dp.publicationid = pub.publicationid
INNER JOIN
	     ndb.publicationtypes AS pt  ON     pub.pubtypeid = pt.pubtypeid
WHERE
  (${pubid}      IS NULL OR pub.publicationid = ANY (${pubid}::int[]))     AND
  (${datasetid}  IS NULL OR      dp.datasetid = ANY (${datasetid})) AND
  (${familyname} IS NULL OR     ca.familyname LIKE  ${familyname})  AND
  (${pubtype}    IS NULL OR        pt.pubtype =     ${pubtype})     AND
  (${year}       IS NULL OR          pub.year =     ${year})        AND
  (${search}     IS NULL OR      pub.citation SIMILAR TO (${search}))
GROUP BY pub.publicationid, pt.pubtype, ca.contactid
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
             ELSE ${offset}
        END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
