WITH sitid AS 
(SELECT * FROM ndb.sitegeopolitical AS sgp WHERE
(${gpid} IS NULL OR sgp.geopoliticalid = ${gpid}))
SELECT * FROM ndb.sites AS sites WHERE
(${sitename} IS NULL OR sites.sitename LIKE ${sitename})
AND (${altmin} IS NULL OR sites.altitude >= ${altmin})
AND (${altmax} IS NULL OR sites.altitude <= ${altmax})
AND sites.siteid IN (SELECT siteid FROM sitid)