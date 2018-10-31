CREATE OR REPLACE FUNCTION ndbdata(dsid integer)
RETURNS jsonb
LANGUAGE pgsql;
SELECT json_build_object('datasetid', ds.datasetid,
                         'sampleid', dsd.sampleid,
		                     'depth', anu.depth,
                      	 'counts', json_agg(json_build_object('value', dt.value,
                      				 'variablename', tx.taxonname,
                      				 'element', ve.variableelement,
                      				 'context', vc.variablecontext,
                      				 'units', vru.variableunits)),
                      	 'ages', json_agg(
                      			json_build_object('chronologyid', ch.chronologyid,
                      							  'chronologyname', ch.chronologyname,
                      							  'agetype', cht.agetype,
                      							  'age', sma.age,
                      							  'ageyounger', sma.ageyounger,
                      							  'ageolder', sma.ageolder)))
FROM
  ndb.datasets AS ds
  JOIN ndb.dsdatasample AS dsd ON dsd.datasetid = ds.datasetid
  JOIN ndb.data AS dt ON dt.dataid = dsd.dataid
  JOIN ndb.variables as var ON var.variableid = dsd.variableid
  JOIN ndb.taxa AS tx ON tx.taxonid = var.taxonid
  JOIN ndb.variableunits AS vru ON vru.variableunitsid = var.variableunitsid
  JOIN ndb.samples AS smp ON smp.sampleid = dsd.sampleid
  JOIN ndb.analysisunits AS anu ON anu.analysisunitid = smp.analysisunitid
  LEFT JOIN ndb.variableelements AS ve ON ve.variableelementid = var.variableelementid
  LEFT JOIN ndb.variablecontexts AS vc ON vc.variablecontextid = var.variablecontextid
  JOIN ndb.sampleages AS sma ON sma.sampleid = smp.sampleid
  JOIN ndb.chronologies AS ch ON sma.chronologyid = ch.chronologyid
  JOIN ndb.agetypes AS cht ON cht.agetypeid = ch.agetypeid
WHERE
  ds.datasetid = dsid
GROUP BY ds.datasetid,
		dsd.sampleid,
		anu.depth;
