with fulllist as ((select dspi.datasetid, 'Dataset PI' as class
from ndb.contacts cnt
inner join ndb.datasetpis as dspi on dspi.contactid = cnt.contactid
where cnt.contactid = ${contactid})
union all
(select smp.datasetid, 'Sample Analyst' as class
from ndb.contacts cnt
inner join ndb.sampleanalysts as smpa on smpa.contactid = cnt.contactid
inner join ndb.samples as smp on smp.sampleid = smpa.sampleid
where cnt.contactid = ${contactid})
union all
(select dspr.datasetid, 'Data Processor' as class
from ndb.contacts cnt
inner join ndb.dataprocessors as dspr on dspr.contactid = cnt.contactid
where cnt.contactid = ${contactid})
union all
(select ds.datasetid, 'Chronology Modeller' as class
from ndb.contacts cnt
inner join ndb.chronologies as ch on ch.contactid = cnt.contactid
inner join ndb.datasets as ds on ds.collectionunitid = ch.collectionunitid
where cnt.contactid = ${contactid})
union ALL
(select ds.datasetid, 'Collector' as class
from ndb.contacts cnt
inner join ndb.collectors as col on col.contactid = cnt.contactid
inner join ndb.datasets as ds on ds.collectionunitid = col.collectionunitid
where cnt.contactid = ${contactid}))
select datasetid, array_agg(distinct class) as roles
from fulllist
group by datasetid
