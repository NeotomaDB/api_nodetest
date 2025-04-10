 SELECT
  	cnt.contactid AS contactid,
	dts.datasetid AS datasetid,
	cnt.familyname AS familyname,
	cnt.contactname AS contactname,
	cnt.givennames AS givennames,
	sts.sitename AS sitename
	FROM ndb.datasets AS dts
  LEFT JOIN ndb.datasetpis AS dspi ON dspi.datasetid = dts.datasetid
  LEFT JOIN ndb.contacts AS cnt  ON cnt.contactid = dspi.contactid
  LEFT JOIN ndb.datasettypes AS dst ON dst.datasettypeid = dts.datasettypeid
  LEFT JOIN ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid
  LEFT JOIN ndb.sites AS sts ON sts.siteid = clu.siteid
WHERE ${familyname} IS NULL OR cnt.familyname LIKE ${familyname} AND
 ${givennames} IS NULL OR cnt.givennames LIKE ${givennames}