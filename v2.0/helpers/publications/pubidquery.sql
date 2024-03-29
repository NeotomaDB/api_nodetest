SELECT json_build_object('publicationid', pub.publicationid,
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
                                                                        'order', pa.authororder)),
                         'datasets', json_agg(DISTINCT jsonb_build_object('siteid', sts.siteid,
                                                                   'datasetid', dp.datasetid,
                                                                   'primary', dp.primarypub))) AS publication
FROM             ndb.publications AS pub
INNER JOIN ndb.publicationauthors AS pa ON pub.publicationid = pa.publicationid
INNER JOIN           ndb.contacts AS ca ON ca.contactid = pa.contactid
LEFT JOIN ndb.datasetpublications AS dp ON dp.publicationid = pub.publicationid
LEFT JOIN ndb.dslinks AS sts ON sts.datasetid = dp.datasetid
INNER JOIN   ndb.publicationtypes AS pt  ON     pub.pubtypeid = pt.pubtypeid
WHERE
  (${pubid} IS NULL OR pub.publicationid = ANY(${pubid}))
GROUP BY pub.publicationid, pt.pubtype
