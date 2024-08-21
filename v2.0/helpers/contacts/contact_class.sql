WITH chronfolk AS (
  SELECT DISTINCT  contactid,
  		 'Researcher'::text AS contributorType
  FROM     ndb.datasets AS d
  JOIN ndb.chronologies AS chron ON d.collectionunitid = chron.collectionunitid
  WHERE d.datasetid = $1
),
collfolk AS (
  SELECT DISTINCT  contactid, 'DataCollector'::text AS contributortype
  FROM     ndb.datasets AS d
  JOIN   ndb.collectors AS coll ON d.collectionunitid = coll.collectionunitid
  WHERE d.datasetid = $1
),
dpi AS (
 SELECT DISTINCT  contactid,
        'ProjectLeader'::text AS contributortype
 FROM ndb.datasetpis WHERE datasetpis.datasetid = $1
),
curator AS (
  /* In the DB stuff this should be a 'DataSteward' */
  SELECT DISTINCT  contactid, 'DataCurator'::text AS contributortype
  FROM ndb.datasetsubmissions
  WHERE datasetsubmissions.datasetid = $1
),
coauth AS (
  SELECT DISTINCT contactid,
	      'Researcher'::text AS contributortype
  FROM ndb.datasetpublications AS d
  JOIN ndb.publicationauthors AS paut ON d.publicationid = paut.publicationid
  WHERE d.datasetid = $1
),
analyst AS (
	SELECT DISTINCT sana.contactid,
  /* In the DB stuff this should be a 'DataAnalyst' */
	        'DataCollector'::text AS contributortype
  FROM        ndb.samples AS samp
  JOIN ndb.sampleanalysts AS sana ON samp.sampleid = sana.sampleid
  WHERE samp.datasetid = $1
)
SELECT DISTINCT contactname AS creatorname,
                     address AS affiliation,
             contributortype
FROM (SELECT * FROM analyst
UNION ALL
  (SELECT * FROM coauth)
UNION ALL
  (SELECT * FROM curator)
UNION ALL
  (SELECT * FROM dpi)
UNION ALL
  (SELECT * FROM collfolk)
UNION ALL
  (SELECT * FROM chronfolk)) AS lister
JOIN ndb.contacts AS cts ON cts.contactid = lister.contactid
