SELECT
  dts.datasetid,
  chrs.chronologyid,
  aty.agetype  AS modelagetype,
  chrs.isdefault,
  chrs.chronologyname,
  chrs.dateprepared,
  chrs.agemodel,
  chrs.ageboundyounger,
  chrs.ageboundolder,
  chrs.notes,
  cnt.contactid,
  cnt.contactname,
  cnt.familyname,
  cnt.givennames,
  cnt.leadinginitials,
  chctrl.chroncontrolid,
  chctrl.depth,
  chctrl.thickness,
  chctrl.age AS ccage,
  chctrl.agelimityounger,
  chctrl.agelimitolder,
  chty.chroncontroltype,
  gc.geochronid,
  gc.labnumber,
  gct.geochrontype,
  gc.age AS gcage,
  gc.errorolder,
  gc.erroryounger,
  gc.infinite,
  gc.delta13c,
  atyg.agetype AS geochronagetype,
  gc.notes,
  gc.materialdated
FROM                   ndb.chronologies AS chrs
  LEFT OUTER JOIN     ndb.chroncontrols AS chctrl ON chrs.chronologyid = chctrl.chronologyid
  LEFT OUTER JOIN ndb.chroncontroltypes AS chty   ON chctrl.chroncontroltypeid = chty.chroncontroltypeid
  LEFT OUTER JOIN           ndb.dslinks AS dsl    ON chrs.collectionunitid = dsl.collectionunitid
  LEFT OUTER JOIN          ndb.agetypes AS aty    ON chrs.agetypeid = aty.agetypeid
  LEFT OUTER JOIN          ndb.datasets AS dts    ON dsl.datasetid = dts.datasetid
  LEFT OUTER JOIN      ndb.datasettypes AS dty    ON dts.datasettypeid = dty.datasettypeid
  LEFT OUTER JOIN          ndb.contacts AS cnt    ON cnt.contactid = chrs.contactid
  LEFT OUTER JOIN  ndb.geochroncontrols AS gcc    ON gcc.chroncontrolid = chctrl.chroncontrolid
  LEFT OUTER JOIN     ndb.geochronology AS gc     ON gc.geochronid = gcc.geochronid
  LEFT OUTER JOIN     ndb.geochrontypes AS gct    ON gct.geochrontypeid = gc.geochrontypeid
  LEFT OUTER JOIN          ndb.agetypes AS atyg   ON atyg.agetypeid = gc.agetypeid
WHERE    dts.datasetid IN ($1:csv)
ORDER BY dts.datasetid, chrs.chronologyid, chctrl.chroncontrolid, gc.geochronid
