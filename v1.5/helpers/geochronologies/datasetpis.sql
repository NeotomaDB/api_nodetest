select 
    json_build_object(
            'contactid', ndb.datasetpis.contactid,
            'contactname', c.contactname
    ) as datasetpis
from ndb.datasetpis inner join
ndb.contacts as c on ndb.datasetpis.contactid = c.contactid
where ndb.datasetpis.datasetid = $1
order by ndb.datasetpis.piorder;