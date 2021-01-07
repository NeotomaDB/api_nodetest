SELECT
jsonb_build_object(   'chronologyid', chrs.chronologyid,
                          'agetype', aty.agetype,
                        'modelType', chrs.agemodel,
                          'default', chrs.isdefault,
                   'chronologyName', chrs.chronologyname,
                     'datePrepared', chrs.dateprepared,
                'reliableagespan', json_build_object('younger', chrs.ageboundyounger,
                                                         'older', chrs.ageboundolder),
                  'chronologynotes', chrs.notes,
                       'preparedby', json_build_object('contactid', cnt.contactid,
                                                     'contactname', cnt.contactname,
                                                      'familyname', cnt.familyname,
                                                       'firstname', cnt.givennames,
                                                        'initials', cnt.leadinginitials),
         'datasets', json_agg(DISTINCT jsonb_build_object('datasetid', dts.datasetid,
                                          'datasettype', dty.datasettype)),
          'controls', json_agg(DISTINCT jsonb_build_object(
                                                        'chroncontrolid', chctrl.chroncontrolid,
                                                        'analysisunitid', au.analysisunitid,
                                                        'analysisunitname', au.analysisunitname,
                                                                 'depth', chctrl.depth,
                                                             'thickness', chctrl.thickness,
                                                               'agetype', atyct.agetype,
                                                                   'age', chctrl.age,
                                                            'controllimits', json_build_object('ageyounger', chctrl.agelimityounger,
                                                                                                 'ageolder', chctrl.agelimitolder),
                                                           'controltype', chty.chroncontroltype,
                                                                 'notes', chctrl.notes,
                                                              'geochron', jsonb_build_object(
                                                                'geochronid', gc.geochronid,
                                                                'geochronlabnumber', gc.labnumber,
                                                                'geochrontype', gct.geochrontype,
                                                                'geochronage', jsonb_build_object('age', gc.age,
                                                                                                  'errorolder', gc.errorolder,
                                                                                                  'erroryounger', gc.erroryounger),
                                                                'infinite', gc.infinite,
                                                                'delta13c', gc.delta13c,
                                                                'geochronagetype', atyg.agetype,
                                                                'notes', gc.notes,
                                                                'materialdated', gc.materialdated),
		  													'relativeage', jsonb_build_object('relativeage', ra.relativeage,
																							  'c14ages', jsonb_build_object('c14ageyounger', ra.c14ageyounger,
																														    'c14ageolder', ra.c14ageolder),
																							  'calages', jsonb_build_object('calageyounger', ra.calageyounger,
																														    'calageolder', ra.calageolder))))) AS chronology
FROM                    ndb.chronologies AS chrs
  LEFT OUTER JOIN      ndb.chroncontrols AS chctrl ON chrs.chronologyid = chctrl.chronologyid
  LEFT OUTER JOIN  ndb.chroncontroltypes AS chty   ON chctrl.chroncontroltypeid = chty.chroncontroltypeid
  LEFT OUTER JOIN            ndb.dslinks AS dsl    ON chrs.collectionunitid = dsl.collectionunitid
  LEFT OUTER JOIN           ndb.agetypes AS aty    ON chrs.agetypeid = aty.agetypeid
  LEFT OUTER JOIN           ndb.agetypes AS atyct  ON chctrl.agetypeid = aty.agetypeid
  LEFT OUTER JOIN           ndb.datasets AS dts    ON dsl.datasetid = dts.datasetid
  LEFT OUTER JOIN       ndb.datasettypes AS dty    ON dts.datasettypeid = dty.datasettypeid
  LEFT OUTER JOIN           ndb.contacts AS cnt    ON cnt.contactid = chrs.contactid
  LEFT OUTER JOIN   ndb.geochroncontrols AS gcc    ON gcc.chroncontrolid = chctrl.chroncontrolid
  LEFT OUTER JOIN      ndb.geochronology AS gc     ON gc.geochronid = gcc.geochronid
  LEFT OUTER JOIN      ndb.geochrontypes AS gct    ON gct.geochrontypeid = gc.geochrontypeid
  LEFT OUTER JOIN           ndb.agetypes AS atyg   ON atyg.agetypeid = gc.agetypeid
  LEFT OUTER JOIN ndb.relativechronology AS rc     ON rc.analysisunitid = chctrl.analysisunitid
  LEFT OUTER JOIN       ndb.relativeages AS ra     ON ra.relativeageid = rc.relativeageid
  LEFT JOIN       ndb.analysisunits AS au     ON au.analysisunitid = chctrl.analysisunitid
WHERE    dsl.siteid IN ($1:csv)
GROUP BY chrs.chronologyid, aty.agetype, cnt.contactid
