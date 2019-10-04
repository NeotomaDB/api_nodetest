select     
    json_build_object(
            'sampleid', gc.sampleid, 
            'geochrontype', gtp.geochrontype, 
            'agetype', atp.agetype, 
            'depth', au.depth, 
            'thickness', au.thickness, 
            'age', gc.age, 
            'errorolder', gc.errorolder, 
            'erroryounger', gc.erroryounger, 
            'infinite', gc.infinite, 
            'delta13c', gc.delta13c, 
            'labnumber', gc.labnumber, 
            'materialdated', gc.materialdated, 
            'notes', gc.notes
                      ) as samples
from         
          ndb.geochronology gc 
          inner join ndb.samples s on gc.sampleid = s.sampleid 
          inner join ndb.datasets dts on s.datasetid = dts.datasetid 
          inner join ndb.geochrontypes gtp on gc.geochrontypeid = gtp.geochrontypeid 
          inner join ndb.agetypes atp on gc.agetypeid = atp.agetypeid 
          inner join ndb.analysisunits au on s.analysisunitid = au.analysisunitid
where     
          (dts.datasetid = $1  and (dts.datasettypeid = 1));