SELECT doi.doiapi(${datasetid}) AS data
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
                 ELSE ${offset}
            END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
        END);
