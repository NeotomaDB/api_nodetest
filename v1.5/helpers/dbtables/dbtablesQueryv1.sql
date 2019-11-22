SELECT * 
  FROM
  ${schemaname~}.${tablename~}
  
  (CASE WHEN ${sortfield~} IS NOT NULL THEN 
    || ' ORDER BY ' || ${sortfield} || ' ' || ${order} || ' ' 
          ELSE NULL 
        END
  )
    
OFFSET (CASE WHEN ${offset} IS NULL THEN 0
            ELSE ${offset}
       END)
LIMIT (CASE WHEN ${limit} IS NULL THEN 25
            ELSE ${limit}
       END);

/* need this syntax which requires a sortfield name

SELECT * 
FROM "ndb"."relativeagescales" 

ORDER BY (CASE WHEN 'relativeagescale' IS NOT NULL 
  THEN "relativeagescale" || ' ' || 'ASC' || ' ' ELSE 
    NULL 
  END 
 ) 
OFFSET 
  (CASE WHEN null IS NULL 
    THEN 0 
    ELSE null 
   END) 
LIMIT 
  (CASE WHEN null IS NULL 
    THEN 25 
   ELSE null 
   END);

*/