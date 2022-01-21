  SELECT DISTINCT sgp.siteid, gp.geoin
  FROM
    ndb.geopaths AS gp
    INNER JOIN ndb.sitegeopolitical AS sgp ON sgp.geopoliticalid = gp.geoin
    WHERE ARRAY[3180] && gp.geoout OR sgp.geopoliticalid = ANY(ARRAY[3180])
    GROUP BY sgp.siteid, gp.geoin;