SELECT
  json_build_object(   'chronologyid', chrs.chronologyid,
                            'agetype', aty.agetype,
                               'modelType', chrs.agemodel,
                            'default', chrs.isdefault,
                     'chronologyName', chrs.chronologyname,
                       'datePrepared', chrs.dateprepared,
                  'chronologyagespan', json_build_object('younger', chrs.ageboundyounger,
                                                           'older', chrs.ageboundolder),
                    'chronologynotes', chrs.notes,
                         'preparedby', json_build_object('contactid', cnt.contactid,
                                                       'contactname', cnt.contactname,
                                                        'familyname', cnt.familyname,
                                                         'firstname', cnt.givennames,
                                                          'initials', cnt.leadinginitials),
                         'controls', json_agg(
                                           json_build_object('datasetid', dts.datasetid,
                                            'datasettype', dty.datasettype,
                                            'controls',
                                           json_build_object('chroncontrols', json_build_object(
                                                          'chroncontrolid', chctrl.chroncontrolid,
                                                                   'depth', chctrl.depth,
                                                               'thickness', chctrl.thickness,
                                                                     'age', chctrl.age,
                                                              'ageyounger', chctrl.agelimityounger,
                                                                'ageolder', chctrl.agelimitolder,
                                                             'controltype', chty.chroncontroltype)
                                                         )))) AS chronology
FROM                   ndb.chronologies AS chrs
  LEFT OUTER JOIN     ndb.chroncontrols AS chctrl ON chrs.chronologyid = chctrl.chronologyid
  LEFT OUTER JOIN ndb.chroncontroltypes AS chty   ON chctrl.chroncontroltypeid = chty.chroncontroltypeid
  LEFT OUTER JOIN           ndb.dslinks AS dsl    ON chrs.collectionunitid = dsl.collectionunitid
  LEFT OUTER JOIN          ndb.agetypes AS aty    ON chrs.agetypeid = aty.agetypeid
  LEFT OUTER JOIN          ndb.datasets AS dts    ON dsl.datasetid = dts.datasetid
  LEFT OUTER JOIN      ndb.datasettypes AS dty    ON dts.datasettypeid = dty.datasettypeid
  LEFT OUTER JOIN          ndb.contacts AS cnt    ON cnt.contactid = chrs.contactid

WHERE    dsl.siteid IN ($1:csv)
GROUP BY chrs.chronologyid, aty.agetype, cnt.contactid
