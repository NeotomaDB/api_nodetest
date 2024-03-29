SELECT
json_build_object('publicationid', pub.publicationid,
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
              'datasets', json_agg(DISTINCT jsonb_build_object('siteid', dsl.siteid,
                                                                   'datasetid', dp.datasetid,
                                                                   'primary', dp.primarypub))) AS publication,
              CASE WHEN ${search} IS NULL
                THEN 1
              ELSE word_similarity(citation, ${search}) 
              END AS match
FROM ndb.publications AS pub
INNER JOIN ndb.publicationauthors AS pa  ON pub.publicationid = pa.publicationid
INNER JOIN ndb.contacts           AS ca  ON      ca.contactid = pa.contactid
LEFT JOIN ndb.datasetpublications AS dp  ON dp.publicationid = pub.publicationid
LEFT JOIN ndb.dslinks             AS dsl ON dsl.datasetid = dp.datasetid
INNER JOIN ndb.publicationtypes   AS pt  ON     pub.pubtypeid = pt.pubtypeid
WHERE
  (${publicationid} IS NULL OR pub.publicationid = ANY (${publicationid}::int[]))     AND
  (${datasetid}  IS NULL OR      dp.datasetid = ANY (${datasetid})) AND
  (${siteid}     IS NULL OR      dsl.siteid = ANY (${siteid})) AND
  (${familyname} IS NULL OR     ca.familyname LIKE  ANY(${familyname}))  AND
  (${pubtype}    IS NULL OR        pt.pubtype =     ANY(${pubtype}))     AND
  (${year}       IS NULL OR          pub.year =     ANY(${year}))        AND
  (${search}     IS NULL OR      word_similarity(citation, ${search}) > 0)
GROUP BY pub.publicationid, pt.pubtype
ORDER BY word_similarity(citation, ${search}) DESC
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
             ELSE ${offset}
        END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
