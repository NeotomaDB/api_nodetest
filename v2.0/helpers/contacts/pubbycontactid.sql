SELECT
  p.publicationid,
  p.citation,
  p.year,
  p.doi
FROM ndb.publications p
INNER JOIN ndb.publicationauthors pa ON pa.publicationid = p.publicationid
WHERE pa.contactid = ${contactid}
ORDER BY p.year DESC, p.publicationid;
