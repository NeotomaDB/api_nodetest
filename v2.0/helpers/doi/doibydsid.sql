SELECT datasetid, min(doi) AS dois FROM ndb.datasetdoi
WHERE datasetid = ANY ($1)
GROUP BY datasetid
