WITH dpub AS
  (SELECT * FROM
  	ndb.datasetpublications as dp
    WHERE ($1 IS NULL OR dp.datasetid IN ($1:csv)))
SELECT json_build_object(
              'datasetid', dpub.datasetid,
              'publicationid', pub.publicationid,
             'pubtypeid', pub.pubtypeid,
             'pubtype', pt.pubtype,
             'year' , pub.year,
             'citation', pub.citation,
             'articletitle', pub.articletitle,
             'journal', pub.journal,
             'volume'  , pub.volume,
             'issue'   , pub.issue,
             'pages'   , pub.pages,
             'citationnumber', pub.citationnumber,
             'doi', pub.doi,
             'booktitle' , pub.booktitle,
             'numvolumes', pub.numvolumes,
             'edition'   , pub.edition,
             'volumetitle', pub.volumetitle,
             'seriestitle', pub.seriestitle,
             'seriesvolume', pub.seriesvolume,
             'publisher' , pub.publisher,
             'url', pub.url,
             'city'      , pub.city,
             'state', pub.state,
             'country'   , pub.country,
             'originallanguage', pub.originallanguage,
             'notes' , pub.notes,
              'author', json_agg(DISTINCT jsonb_build_object('familyname', ca.familyname,
                                                   'givennames', ca.givennames,
                                                   'order', pa.authororder))) AS publication
FROM ndb.publications AS pub
  INNER JOIN ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid
  INNER JOIN ndb.contacts as ca ON ca.contactid = pa.contactid
  INNER JOIN ndb.publicationtypes AS pt  ON     pub.pubtypeid = pt.pubtypeid
  INNER JOIN (SELECT * FROM dpub) AS dpub ON dpub.publicationid = pub.publicationid
GROUP BY pub.publicationid, pt.pubtype, dpub.datasetid
