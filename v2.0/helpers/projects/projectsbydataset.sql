SELECT json_build_object(
    'datasetid', ${datasetid},
    'projects', COALESCE(json_agg(
        json_build_object(
            'projectid', g.projectid,
            'projectname', g.projectname,
            'projectdescription', g.projectdescription,
            'participants', g.participants
        )
    ), '[]'::json)
) AS result
FROM (
    SELECT
        p.projectid,
        p.projectname,
        p.projectdescription,
        COALESCE(json_agg(
            json_build_object(
                'contactid', c.contactid,
                'contactname', c.contactname,
                'email', c.email
            )
        ) FILTER (WHERE c.contactid IS NOT NULL), '[]'::json) AS participants
    FROM ndb.projectdatasets pd
    INNER JOIN ndb.projects p ON p.projectid = pd.projectid
    LEFT JOIN ndb.projectparticipants pp ON pp.projectid = p.projectid
    LEFT JOIN ndb.contacts c ON c.contactid = pp.contactid
    WHERE pd.datasetid = ${datasetid}
    GROUP BY p.projectid, p.projectname, p.projectdescription
) AS g;
