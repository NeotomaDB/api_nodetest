SELECT *
      FROM ap.explorersearch(
            _taxonids:=${_taxonids},
            _elemtypeids:=${_elemtypeids},
            _taphtypeids:=${_taphtypeids},
            _depenvids:=${_depenvids},
            _abundpct:=${_abundpct},
            _datasettypeid:=${_datasettypeid},
            _keywordid:=${_keywordid},
            _coords:=${_coords},
            _gpid:=${_gpid},
            _altmin:=${_altmin},
            _altmax:=${_altmax},
            _coltypeid:=${_coltypeid},
            _dbid:=${_dbid},
            _sitename:=${_sitename},
            _contactid:=${_contactid},
            _ageold:=${_ageold},
            _ageyoung:=${_ageyoung},
            _agedocontain:=${_agedocontain},
            _agedirectdate:=${_agedirectdate},
            _subdate:=${_subdate},
            _debug:=${_debug}
      );
