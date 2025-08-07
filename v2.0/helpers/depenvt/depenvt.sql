select cu.siteid, cu.collectionunitid, ds.datasetid, det.depenvt
from ndb.collectionunits as cu
inner join ndb.datasets as ds on ds.collectionunitid = cu.collectionunitid
LEFT join ndb.depenvttypes as det on det.depenvtid = cu.depenvtid
where
(${datasetid} is null or ds.datasetid = any(${datasetid}))
offset ${offset} 
limit ${limit};