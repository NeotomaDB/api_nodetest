SELECT json_build_object(
    'datasetid', ${datasetid},
    'assays', COALESCE(json_agg(g.obj), '[]'::json)
) AS result
FROM (
    SELECT json_build_object(
        'assayid', a.assayid,
        'assayname', a.assayname,
        'assaytype', at.assaytype,
        'targettaxonomicassay', a.targettaxonomicassay,
        'targetgene', a.targetgene,
        'subfragment', a.subfragment,
        'ampliconsize', a.ampliconsize,
        'pcrprimerforward', a.pcrprimerforward,
        'pcrprimerreverse', a.pcrprimerreverse,
        'pcrprimernameforward', a.pcrprimernameforward,
        'pcrprimernamereverse', a.pcrprimernamereverse,
        'pcrprimerreferenceforward', a.pcrprimerreferenceforward,
        'pcrprimerreferencereverse', a.pcrprimerreferencereverse,
        'probeseq', a.probeseq,
        'proberef', a.proberef,
        'probereporter', a.probereporter,
        'probequencher', a.probequencher,
        'probeconc', a.probeconc,
        -- FAIRe Project-section terms. The columns are underscored while every
        -- key in this payload is not, so the aliases keep the two conventions
        -- from meeting anywhere but here. neg_cont/pos_cont are BOOLEAN and are
        -- passed through uncast, so NULL ("unknown") stays distinct from false.
        'sterilisemethod', a.sterilise_method,
        'negcont', a.neg_cont,
        'poscont', a.pos_cont,
        'libraries', COALESCE((
            SELECT json_agg(json_build_object(
                'libraryid', l.libraryid,
                'libid', l.libid,
                'seqrunid', l.seqrunid,
                'pcrplateid', l.pcrplateid,
                'barcodingpcrappr', l.barcodingpcrappr,
                'platform', l.platform,
                'instrument', l.instrument,
                'seqkit', l.seqkit,
                'libscreen', l.libscreen
            ))
            FROM ndb.aednalibraries l
            WHERE l.assayid = a.assayid
        ), '[]'::json)
    ) AS obj
    FROM ndb.aednaassays a
    LEFT JOIN ndb.assaytypes at ON at.assaytypeid = a.assaytypeid
    WHERE a.datasetid = ${datasetid}
) AS g;
