SELECT txa.taxonid,
    txa.taxonname,
    extxa.extdatabaseid,
    extxa.exttaxonid,
    extxa.url,
    extdb.extdatabasename,
    extdb.url
 FROM ndb.taxa as txa
LEFT JOIN ndb.externaltaxa as extxa on extxa.taxonid = txa.taxonid
LEFT JOIN ndb.externaldatabases as extdb on extdb.extdatabaseid = extxa.extdatabaseid
WHERE (txa.taxonid = ${taxonid})