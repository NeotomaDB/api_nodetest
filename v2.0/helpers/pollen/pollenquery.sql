USE [Neotoma]
GO
/****** Object:  StoredProcedure [DA].[Pollen]    Script Date: 9/13/2017 12:50:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- [DA].[Pollen]

-- ===================================================================================================================
-- Author:		Brian Bills
-- Create date: 01/14/2016
-- Description:	The whole enchilada, baby...
--					
-- Requires:	user-defined table type: DA.integer_list_tbltype
--              view: AP.DatasetPIsAuthors
--				view: AP.DatasetKeywords
--              view: DA.vSampAgesStd
--
-- Change log:
-- MCA 5/18/2016 Modified to use geometry for searching. I couldn't let you leave without finally adding a comment to a stored procedure.
-- ===================================================================================================================

ALTER PROCEDURE [DA].[Pollen]

  -- input parameters
  @taxonIds DA.integer_list_tbltype READONLY,
  -- @depEnvIds DA.integer_list_tbltype READONLY,
  @taxonName nvarchar(200) = NULL,
  @nameType nvarchar(10) = 'tax',  -- tax, base, match
  @keywordId int = NULL,
  @loc nvarchar(MAX) = NULL,
  @gpId int = NULL,
  @altMin int = NULL,
  @altMax int = NULL,
  @colTypeId int = NULL,
  @dbId int = NULL,
  @siteIds DA.integer_list_tbltype READONLY,
  @siteName nvarchar(200) = NULL,
  @contactId int = NULL,
  @ageOld int = NULL,
  @ageYoung int = NULL,
  @ageDoContain bit = 1,
  @subDate datetime = NULL,
  @debug int = 0

  -- output parameters
  -- none
AS
  SET NOCOUNT ON;

  DECLARE 
    @sql nvarchar(MAX),
	@paramlist nvarchar(MAX),
	@doDepEnv bit = 0,
	@hasTaxa bit = 0,
	@poly geometry = NULL,
	@cteTax nvarchar(MAX),
	@cteTaxSelect nvarchar(MAX),
	@cteTaxFrom nvarchar(MAX),
	@cteTaxWhere nvarchar(MAX),
	@cteBase nvarchar(MAX),
	@cteBaseSelect nvarchar(MAX),
	@cteBaseFrom nvarchar(MAX),
	@cteBaseWhere nvarchar(MAX),
	@cteAges nvarchar(MAX),
	@cteAgesSelect nvarchar(MAX),
	@cteAgesFrom nvarchar(MAX),
	@cteAgesWhere nvarchar(MAX),
	@cteDs nvarchar(MAX),
	@cteDsSelect nvarchar(MAX),
	@cteDsFrom nvarchar(MAX),
	@cteDsWhere nvarchar(MAX)

  -- IF (SELECT count(*) from @depEnvIds) > 0
  --  SELECT @doDepEnv = 1
  -- need to put back in param list and string for sp_executesql
  SELECT @doDepEnv = 0

  -- START building tax CTE

  IF (SELECT count(*) from @taxonIds) > 0
    BEGIN
      SELECT @cteTax = '
    WITH tax AS (
      SELECT
        n as TaxonID
      FROM
        @taxonIds
    )'
	  SELECT @hasTaxa = 1
	END
  ELSE
    IF @taxonName IS NOT NULL
	  BEGIN
	    SELECT @hasTaxa = 1
		IF @nameType = 'base'
		  SELECT @cteTax = '
	WITH tax AS (
      SELECT 
        t.TaxonID,
		t.HigherTaxonID
      FROM 
        NDB.Taxa t
      WHERE 
        t.TaxonName = @taxonName
      UNION ALL
      SELECT 
        child.TaxonID, 
		child.HigherTaxonID
      FROM 
        tax AS parent 
	    INNER JOIN NDB.Taxa AS child ON parent.TaxonID = child.HigherTaxonID
    )'
		ELSE
		  BEGIN
		  	SELECT @cteTax = '
	WITH tax AS (
      SELECT 
        t.TaxonID
	  FROM
	    NDB.Taxa t'
		    IF @nameType = 'tax'
			  SELECT @cteTax = @cteTax + '
      WHERE
	    t.TaxonName = @taxonName'
		    ELSE
			  SELECT @cteTax = @cteTax + '
	  WHERE
		t.TaxonName LIKE ''%'' + @taxonName + ''%''' 		 
	        SELECT @cteTax = @cteTax + '
	)'
		  END
	  END
	ELSE
	  BEGIN
	    SELECT @hasTaxa = 0
		SELECT @cteTax = '
    WITH tax AS (
      SELECT
        NULL as TaxonID
    )'
	  END

  -- END building tax CTE


  -- START building base CTE
  
  SELECT @cteBase = ',
    base AS ('
	
  SELECT @cteBaseSelect = '
      SELECT
	    s.SampleID, 
        s.DatasetID,
		v.TaxonID,
		d.Value'
  SELECT @cteBaseFrom = '
	  FROM
	    NDB.Samples s
		JOIN NDB.Data d ON s.SampleID = d.SampleID
		JOIN NDB.Variables v ON d.VariableID = v.VariableID'
  SELECT @cteBaseWhere = '
	  WHERE
	    v.VariableUnitsID = 19'  --only work on data expressed as NISP
		
  IF @hasTaxa = 1
	SELECT @cteBaseWhere = @cteBaseWhere + '
		AND v.TaxonID IN (SELECT tax.TaxonID FROM tax)'

  IF @keywordId IS NOT NULL
	BEGIN
	  SELECT @cteBaseFrom = @cteBaseFrom + '
		JOIN NDB.SampleKeywords k on s.SampleID = k.SampleID'
	  SELECT @cteBaseWhere = @cteBaseWhere + '
		AND k.KeywordID = @keywordId'
	END

  SELECT @cteBase = @cteBase + @cteBaseSelect + @cteBaseFrom + @cteBaseWhere + ')'
  
  -- END building base CTE


  -- START building ages CTE

  SELECT @cteAges = ',
	ages AS ('
  SELECT @cteAgesSelect = '
	  SELECT
		base.*,
		sa.Age,
		sa.AgeYounger,
		sa.AgeOlder'
  SELECT @cteAgesFrom = '
	  FROM
		base'
  SELECT @cteAgesWhere = '
	  WHERE
		1=1'
 
  IF NOT (@ageOld IS NULL AND @ageYoung IS NULL)
    BEGIN
	  SELECT @cteAgesFrom = @cteAgesFrom + '
		JOIN BWB.tSampAgesStd sa ON base.SampleID = sa.SampleID'
	  IF @ageOld IS NULL
		SELECT @ageOld = 10000000
	  IF @ageYoung IS NULL
		SELECT @ageYoung = -250
	  IF @ageDoContain = 1
		SELECT @cteAgesWhere = @cteAgesWhere + ' 
		AND (
		  (@AgeYoung <= sa.Age AND sa.Age <= @AgeOld) OR
		  (@AgeYoung <= sa.AgeYounger AND sa.AgeOlder <= @AgeOld)
		)'
	  ELSE
		SELECT @cteAgesWhere = @cteAgesWhere + '
		AND (
		  (@AgeYoung <= sa.Age AND sa.Age <= @AgeOld) OR
		  NOT (sa.AgeOlder < @ageYoung OR @ageOld < sa.AgeYounger)
		)'
    END
  ELSE
	SELECT @cteAgesFrom = @cteAgesFrom + '
	    LEFT JOIN BWB.tSampAgesStd sa ON base.SampleID = sa.SampleID'

  SELECT @cteAges = @cteAges + @cteAgesSelect + @cteAgesFrom + @cteAgesWhere + '
    )'

  -- END building ages CTE


  -- START building ds (dataset) CTE

  SELECT @cteDs = ',
    ds AS ('
  SELECT @cteDsSelect = '
	  SELECT
	    ds.DatasetID,
		ds.RecDateCreated,
		cu.CollTypeID,
		cu.DepEnvtID,
		s.SiteID,
		s.SiteName,
		s.Altitude,
		s.geog,
		s.LatitudeNorth,
	    s.LatitudeSouth,
	    s.LongitudeEast,
	    s.LongitudeWest'
  SELECT @cteDsFrom = '
	  FROM
	    NDB.Datasets ds 
		JOIN NDB.CollectionUnits cu ON ds.CollectionUnitID = cu.CollectionUnitID
		JOIN NDB.Sites s ON cu.SiteID = s.SiteID'
  SELECT @cteDsWhere = '
	  WHERE
		ds.DatasetTypeID = 3'  --only work with pollen

  --IF @siteId IS NOT NULL
  IF (SELECT count(*) from @siteIds) > 0                                           
    SELECT @cteDsWhere = @cteDsWhere + ' 
		AND s.SiteID in (select n as SiteId from @siteIds)' 
  IF @siteName IS NOT NULL                                           
    SELECT @cteDsWhere = @cteDsWhere + ' 
		AND s.SiteName LIKE ''%'' + @sitename + ''%'''                                                                    
  IF @subDate IS NOT NULL
	SELECT @cteDsWhere = @cteDsWhere + ' 
		AND ds.RecDateCreated >= @subDate'
  IF @gpId IS NOT NULL                                               
	SELECT @cteDsWhere = @cteDsWhere + ' 
	    AND EXISTS (SELECT *
                    FROM   NDB.SiteGeoPolitical gp
                    WHERE  gp.SiteID = s.SiteID
			        AND    gp.GeoPoliticalID = @gpId)'
  IF @doDepEnv = 1
	SELECT @cteDsWhere = @cteDsWhere + ' 
		AND cu.DepEnvtID IN (SELECT n FROM @depEnvIds)'
  IF @colTypeId IS NOT NULL
	SELECT @cteDsWhere = @cteDsWhere + ' 
		AND cu.CollTypeID = @colTypeId'
  IF @altMin IS NOT NULL
	SELECT @cteDsWhere = @cteDsWhere + ' 
		AND s.Altitude >= @altMin'
  IF @altMax IS NOT NULL
	SELECT @cteDsWhere = @cteDsWhere + ' 
		AND s.Altitude <= @altMax'
  IF @dbId IS NOT NULL
	SELECT @cteDsWhere = @cteDsWhere + ' 
		AND EXISTS (SELECT *
					FROM   NDB.DatasetDatabases db
					WHERE  db.DatasetID = ds.DatasetID
					AND    db.DatabaseID = @dbId)'
  IF @contactId IS NOT NULL
	SELECT @cteDsWhere = @cteDsWhere + ' 
		AND EXISTS (SELECT *
					FROM   AP.DatasetPIsAuthors p
					WHERE  p.DatasetID = ds.DatasetID
					AND    p.ContactID = @contactId)'
  IF @loc IS NOT NULL
	BEGIN
	  SET @poly = geometry::STPolyFromText(@loc, 4326)
	  SELECT @cteDsWhere = @cteDsWhere + ' 
		AND s.geom.STIntersects(@poly) = 1'
	END

  SELECT @cteDs = @cteDs + @cteDsSelect + @cteDsFrom + @cteDsWhere + '
    )'
  
  -- END building ds (dataset) CTE


  SELECT @sql = @cteTax + @cteBase + @cteAges + @cteDs + '
    SELECT
	  ages.SampleID,
	  ages.TaxonID,
	  tx.TaxonName,
	  ages.Value,
	  ''NISP'' AS VariableUnits,
	  ages.Age,
	  ages.AgeOlder,
	  ages.AgeYounger,
	  ds.DatasetID,
	  ds.SiteID,
	  ds.SiteName,
	  ds.Altitude,
	  ds.LatitudeNorth,
	  ds.LatitudeSouth,
	  ds.LongitudeEast,
	  ds.LongitudeWest,
	  ps.*
    FROM
	  ages INNER JOIN
	  NDB.Taxa tx on ages.TaxonID = tx.TaxonID INNER JOIN
	  AP.PollenSums ps on ages.SampleID = ps.SampleID INNER JOIN 
	  ds ON ages.DatasetID = ds.DatasetID'

  IF @debug > 0
	BEGIN
	  PRINT @sql
	  IF @debug = 1
		RETURN
	END                                                 
		                           
  SELECT @paramlist = '
    @taxonIds DA.integer_list_tbltype READONLY,
	@taxonName nvarchar(200),
    @nameType nvarchar(10),
	@keywordId int,
	@loc nvarchar(MAX),
	@gpId int,
	@altMin int,
	@altMax int,
	@colTypeId int,
	@dbId int,
	@siteIds DA.integer_list_tbltype READONLY,
	@siteName nvarchar(200),
	@contactId int,
    @ageOld	int,
	@ageYoung int,
	@subDate datetime,
	@poly geometry'   
	
   -- log the sql and subDate to debug
	insert into mca.testExplorerSearch ([sql], subDate, dateAndTime, wkt)
	values (@sql, @subDate, GEtDate(), @poly.STAsText())                       
                                                     
  EXEC sp_executesql @sql, @paramlist,
					 @taxonIds, @taxonName, @nameType, @keywordId, @loc,                                 				   
	                 @gpId, @altMin, @altMax, @colTypeId, @dbId, @siteIds, @siteName,  
					 @contactId, @ageOld, @ageYoung, @subDate, @poly                   


