CREATE OR REPLACE FUNCTION ap.explorersearch(_taxonids integer[] DEFAULT NULL::integer[],
                                             _elemtypeids integer[] DEFAULT NULL::integer[],
                                             _taphtypeids integer[] DEFAULT NULL::integer[],
                                             _depenvids integer[] DEFAULT NULL::integer[],
                                             _abundpct integer DEFAULT NULL::integer,
                                             _datasettypeid integer DEFAULT NULL::integer,
                                             _keywordid integer DEFAULT NULL::integer,
                                             _coords character varying DEFAULT NULL::character varying,
                                             _gpid integer DEFAULT NULL::integer,
                                             _altmin integer DEFAULT NULL::integer,
                                             _altmax integer DEFAULT NULL::integer,
                                             _coltypeid integer DEFAULT NULL::integer,
                                             _dbid integer DEFAULT NULL::integer,
                                             _sitename character varying DEFAULT NULL::character varying,
                                             _contactid integer DEFAULT NULL::integer,
                                             _ageold integer DEFAULT NULL::integer,
                                             _ageyoung integer DEFAULT NULL::integer,
                                             _agedocontain boolean DEFAULT true,
                                             _agedirectdate boolean DEFAULT false,
                                             _subdate date DEFAULT NULL::date,
                                             _debug boolean DEFAULT false)
 RETURNS TABLE(datasetid integer, datasettype character varying, databasename character varying, minage double precision, maxage double precision, ageyoungest double precision, ageoldest double precision, siteid integer, sitename character varying, sitedescription text, notes text, collunithandle character varying, collunitname character varying, latitudenorth double precision, latitudesouth double precision, longitudeeast double precision, longitudewest double precision)
 LANGUAGE plpgsql
AS $function$

SELECT qt.datasetid, 
       qt.datasettype,
       qt.databasename,
       qt.younger AS ageyoungest,
       qt.older AS ageoldest,
       qt.siteid,
       qt.sitename,
       st.sitedescription,
       st.notes,
       cu.collunithandle,
       cu.collunitname,
       st.latitudenorth,
       st.latitudesouth,
       st.longitudeeast,
       st.longitudewest 
FROM ap.querytable AS qt
INNER JOIN ndb.constituentdatabases AS cdb ON cdb.databaseid = qt.databaseid
WHERE
	  (${_sitename} IS NULL OR qt.sitename ILIKE ${_sitename})
	  AND (${_dbid} IS NULL qt.databaseid = ${_dbid})
	  AND (${_datasettypeid} IS NULL OR qt.datasettype = ${_datasettypeid})
	  AND (${_coords}    IS NULL OR NOT ST_Disjoint(ST_GeogFromText(_coords)::geometry, qt.geog::geometry))
	  AND (${_siteid} IS NULL OR qt.siteid = ANY(${siteid}))
	  AND (${_datasetid} IS NULL OR qt.datasetid = ANY(${datasetid}))
	  AND (${doi} IS NULL OR dsdoi.doi = ANY(${doi}))
	  AND (${_gpid} IS NULL OR qt.geopol && ${_gpid})
	  AND (${keywords} IS NULL OR qt.keywords && ${keywords})
	  AND (${_contactid} IS NULL OR qt.contacts = ${_contactid})
	  AND (${taxa} IS NULL OR qt.taxa && ${taxa})