WITH dpub AS
  (SELECT * FROM
  	ndb.datasetpublications as dp
    WHERE ($1 IS NULL OR dp.datasetid IN ($1:csv)))
SELECT json_build_object(
              'datasetid', dpub.datasetid,
              'publicationid', pub.publicationid,
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
                                                   'order', pa.authororder))) AS publication
FROM
          ndb.publications AS pub
  INNER JOIN
    ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid
  INNER JOIN
    ndb.contacts as ca ON ca.contactid = pa.contactid
  INNER JOIN
      ndb.publicationtypes AS pt  ON     pub.pubtypeid = pt.pubtypeid
  INNER JOIN (SELECT * FROM dpub) AS dpub ON dpub.publicationid = pub.publicationid
GROUP BY pub.publicationid, pt.pubtype, dpub.datasetid
