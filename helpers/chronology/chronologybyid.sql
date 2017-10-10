SELECT     NDB.Chronologies.ChronologyID, NDB.AgeTypes.AgeType, NDB.Chronologies.IsDefault, NDB.Chronologies.ChronologyName, NDB.Chronologies.DatePrepared, 
                      NDB.Chronologies.AgeModel, NDB.Chronologies.AgeBoundYounger, NDB.Chronologies.AgeBoundOlder,NDB.Chronologies.Notes, NDB.ChronControls.ChronControlID, NDB.ChronControls.Depth AS 'controlDepth', 
                      NDB.ChronControls.Thickness AS 'controlThickness', NDB.ChronControls.Age as 'controlAge', NDB.ChronControls.AgeLimitYounger AS 'controlAgeYounger', 
                      NDB.ChronControls.AgeLimitOlder AS 'controlAgeOlder', NDB.ChronControlTypes.ChronControlType
FROM         NDB.Chronologies INNER JOIN
                      NDB.AgeTypes ON NDB.Chronologies.AgeTypeID = NDB.AgeTypes.AgeTypeID LEFT JOIN
                      NDB.ChronControls ON NDB.Chronologies.ChronologyID = NDB.ChronControls.ChronologyID LEFT JOIN
                      NDB.ChronControlTypes ON NDB.ChronControls.ChronControlTypeID = NDB.ChronControlTypes.ChronControlTypeID


	WHERE	NDB.Chronologies.ChronologyID = @chronID

	-- return datasets too
	SELECT     NDB.Datasets.DatasetID, NDB.DatasetTypes.DatasetType

FROM         NDB.Chronologies INNER JOIN

                      NDB.CollectionUnits ON NDB.Chronologies.CollectionUnitID = NDB.CollectionUnits.CollectionUnitID INNER JOIN

                      NDB.Datasets ON NDB.CollectionUnits.CollectionUnitID = NDB.Datasets.CollectionUnitID INNER JOIN

                      NDB.DatasetTypes ON NDB.Datasets.DatasetTypeID = NDB.DatasetTypes.DatasetTypeID INNER JOIN

                      NDB.SampleAges ON NDB.Chronologies.ChronologyID = NDB.SampleAges.ChronologyID INNER JOIN

                      NDB.Samples ON NDB.SampleAges.SampleID = NDB.Samples.SampleID AND NDB.Datasets.DatasetID = NDB.Samples.DatasetID

WHERE     (NDB.SampleAges.ChronologyID = @chronID)

GROUP BY NDB.Datasets.DatasetID, NDB.DatasetTypes.DatasetType