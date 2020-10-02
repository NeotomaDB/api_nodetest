WITH collu AS (
	SELECT sts.siteid,
	       json_build_object('collectionunitid', clu.collectionunitid,
                             'collectionunit', clu.collunitname,
                                     'handle', clu.handle,
                                   'collectionunittype', cts.colltype,
                                    'datasets', json_agg(json_build_object('datasetid', dts.datasetid,
                                                                        'datasettype', dst.datasettype))) AS collectionunit
	FROM
	ndb.datasets AS dts
	LEFT JOIN ndb.collectionunits AS clu ON clu.collectionunitid = dts.collectionunitid
	LEFT JOIN ndb.sites AS sts ON sts.siteid = clu.siteid
	LEFT JOIN ndb.datasettypes AS dst ON dst.datasettypeid = dts.datasettypeid
	LEFT OUTER JOIN ndb.collectiontypes as cts ON clu.colltypeid = cts.colltypeid WHERE
	sts.siteid IN ($1:csv)
	GROUP BY sts.siteid, clu.collectionunitid, cts.colltype
)
SELECT sts.siteid,
        sts.sitename,
        sts.altitude,
        ST_AsGeoJSON(sts.geog,5,2) AS geography,
        sts.sitedescription,
		json_agg(collu.collectionunit) AS collectionunits
FROM
	ndb.sites AS sts
	LEFT JOIN collu AS collu ON collu.siteid = sts.siteid
WHERE
sts.siteid IN ($1:csv)
GROUP BY sts.siteid;
