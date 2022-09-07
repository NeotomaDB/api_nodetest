WITH stpub AS
  (SELECT sts.siteid as siteid, publicationid, primarypub FROM
  	ndb.datasetpublications as dp
  	INNER JOIN
  	ndb.dslinks AS sts
  	ON sts.datasetid = dp.datasetid
    WHERE (${siteid} IS NULL OR sts.siteid = ANY(${siteid})))
SELECT DISTINCT jsonb_build_object('siteid', stpub.siteid,
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
                           'primarypublication', COALESCE(stpub.primarypub, FALSE),
              'author', json_agg(DISTINCT jsonb_build_object('familyname', ca.familyname,
                                                   'givennames', ca.givennames,
                                                   'order', pa.authororder))) AS publication
FROM ndb.publications AS pub
INNER JOIN ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid
INNER JOIN ndb.contacts as ca ON ca.contactid = pa.contactid
INNER JOIN stpub ON pub.publicationid = stpub.publicationid
INNER JOIN ndb.publicationtypes AS pt  ON     pub.pubtypeid = pt.pubtypeid
GROUP BY pub.publicationid, pt.pubtype, stpub.siteid, stpub.primarypub
