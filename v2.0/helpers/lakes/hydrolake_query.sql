SELECT hl.objectid AS hydrolakeid,
    hl.lake_name AS lakename,
    hl.lake_type AS laketype,
    hl.lake_area AS lakearea,
    hl.shore_len AS shorelen,
    hl.vol_total AS volume,
    hl.depth_avg AS avgdepth,
    hl.wshd_area AS watershedarea,
    ST_ASTEXT(hl.shape) AS wkt_shape,
    ST_DISTANCE((SELECT geog FROM ndb.sites WHERE siteid = ${siteid}), hl.shape::geography) AS distance
FROM ap.hydrolakes AS hl
WHERE
ST_DWITHIN((SELECT geog FROM ndb.sites WHERE siteid = ${siteid}), hl.shape::geography, ${buffer});
