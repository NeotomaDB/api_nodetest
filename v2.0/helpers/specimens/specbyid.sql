SELECT ds.datasetid AS datasetid,
       smp.sampleid,
       spec.specimenid,
       jsonb_build_object('repositoryid', repin.repositoryid, 
                          'acronym', repin.acronym, 
                          'repository', repin.repository,
                          'notes', rspec.notes,
                          'repositorynotes', repin.notes) AS repository,
       tx.taxonid, 
       tx.taxonname,
       spec.specimenid AS specimenid,
       ety.elementtype,
       sym.symmetry,
       ep.portion,
       sst.sex,
       sds.domesticstatus,
       tty.taphonomictype,
       spec.nisp AS nisp,
       spec.preservative,
       spec.specimennr,
       spec.fieldnr,
       spec.arctosnr,
       spec.notes,
       em.maturity,
       smp.notes AS samplenotes
FROM ndb.datasets AS ds
LEFT JOIN ndb.repositoryspecimens AS rspec ON rspec.datasetid = ds.datasetid
LEFT JOIN ndb.repositoryinstitutions AS repin ON repin.repositoryid = rspec.repositoryid
INNER JOIN ndb.samples AS smp ON ds.datasetid = smp.datasetid
INNER JOIN ndb.data AS dt ON dt.sampleid = smp.sampleid
INNER JOIN ndb.specimens AS spec ON spec.dataid = dt.dataid
INNER JOIN ndb.variables AS var ON var.variableid = dt.variableid
INNER JOIN ndb.taxa AS tx ON tx.taxonid = var.taxonid
LEFT JOIN ndb.elementtypes AS ety ON ety.elementtypeid = spec.elementtypeid
LEFT JOIN ndb.elementsymmetries AS sym ON sym.symmetryid = spec.symmetryid
LEFT JOIN ndb.elementportions AS ep ON ep.portionid = spec.portionid
LEFT JOIN ndb.elementmaturities AS em ON em.maturityid = spec.maturityid
LEFT JOIN ndb.specimensextypes AS sst ON sst.sexid = spec.sexid
LEFT JOIN ndb.specimendomesticstatustypes AS sds ON sds.domesticstatusid = spec.domesticstatusid
LEFT JOIN ndb.specimentaphonomy AS stph ON stph.specimenid = spec.specimenid
LEFT JOIN ndb.taphonomictypes AS tty ON tty.taphonomictypeid = stph.taphonomictypeid
WHERE spec.specimenid = ANY($1);
