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
              'datasets', COALESCE(json_agg(DISTINCT datasetid) FILTER (WHERE datasetid IS NOT NULL), '[]')) AS publication
FROM ndb.publications AS pub
INNER JOIN ndb.publicationauthors AS pa  ON pub.publicationid = pa.publicationid
INNER JOIN ndb.contacts AS ca  ON      ca.contactid = pa.contactid
LEFT JOIN ndb.datasetpublications AS dp ON dp.publicationid = pub.publicationid
INNER JOIN ndb.publicationtypes AS pt  ON     pub.pubtypeid = pt.pubtypeid
INNER JOIN ndb.pubtsv AS pts ON pts.publicationid = pub.publicationid
WHERE
  (${pubid}      IS NULL OR pub.publicationid = ANY (${pubid}::int[]))     AND
  (${datasetid}  IS NULL OR      dp.datasetid = ANY (${datasetid})) AND
  (${familyname} IS NULL OR     ca.familyname LIKE  ${familyname})  AND
  (${pubtype}    IS NULL OR        pt.pubtype =     ${pubtype})     AND
  (${year}       IS NULL OR          pub.year =     ${year})        AND
<<<<<<< HEAD
  (${search}     IS NULL OR      pts.pubtsv @@ to_tsquery(${search}))
GROUP BY pub.publicationid, pt.pubtype, ca.contactid, pts.pubtsv
ORDER BY ts_rank(pts.pubtsv, to_tsquery('climate')) DESC
=======
  (${doi}        IS NULL OR           pub.doi =     ${doi})         AND
  (${search}     IS NULL OR      pub.citation SIMILAR TO (${search}))
GROUP BY pub.publicationid, pt.pubtype, ca.contactid
>>>>>>> a4458158c8eda7872dc833c7c7b78b3d82771fe8
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
             ELSE ${offset}
        END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);
