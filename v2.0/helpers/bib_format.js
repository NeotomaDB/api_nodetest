
exports.formatpublbib = function (pubobject) {
  var pubout = [];

  for (var i = 0; i < pubobject.length; i++) {
    var pubtype = +pubobject[i]['pubtypeid'];

    switch (pubtype) {
      case 1:
        // Journal Articles:
        console.log('okay');

        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                      'title': pubobject[i]['articletitle'],
                      'year' : pubobject[i]['year'],
                      'journal' : pubobject[i]['journal'],
                      'volume'  : pubobject[i]['volume'],
                      'issue'   : pubobject[i]['issue'],
                      'pages'   : pubobject[i]['pages'],
                      'citation': pubobject[i]['citation'],
                      'doi'       : pubobject[i]['doi']
                    };
        break;
      case 2:
        // Book chapter
        console.log('okay2');

        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                      'title': pubobject[i]['articletitle'],
                      'year' : pubobject[i]['year'],
                      'booktitle' : pubobject[i]['booktitle'],
                      'volume'  : pubobject[i]['volume'],
                      'series'  : pubobject[i]['seriestitle'],
                      'issue'   : pubobject[i]['issue'],
                      'pages'   : pubobject[i]['pages'],
                      'citation': pubobject[i]['citation'],
                      'chapter' : pubobject[i]['chapter'],
                      'note' : pubobject[i]['note'],
                      'publisher' : pubobject[i]['publisher'],
                      'edition'   : pubobject[i]['edition'],
                      'city'      : pubobject[i]['city'],
                      'country'   : pubobject[i]['country'],
                      'doi'       : pubobject[i]['doi']
                    }; 
        break;

      case 3:
        // "Authored Book"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                      'year' : pubobject[i]['year'],
                      'booktitle' : pubobject[i]['booktitle'],
                      'volume'  : pubobject[i]['volume'],
                      'series'  : pubobject[i]['seriestitle'],
                      'citation': pubobject[i]['citation'],
                      'chapter' : pubobject[i]['chapter'],
                      'note' : pubobject[i]['note'],
                      'publisher' : pubobject[i]['publisher'],
                      'edition'   : pubobject[i]['edition'],
                      'city'      : pubobject[i]['city'],
                      'country'   : pubobject[i]['country'],
                      'doi'       : pubobject[i]['doi']
              };
        
        break;

      case 4:
        // "Edited Book"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                      'year' : pubobject[i]['year'],
                      'booktitle' : pubobject[i]['booktitle'],
                      'volume'  : pubobject[i]['volume'],
                      'series'  : pubobject[i]['seriestitle'],
                      'citation': pubobject[i]['citation'],
                      'chapter' : pubobject[i]['chapter'],
                      'note' : pubobject[i]['note'],
                      'publisher' : pubobject[i]['publisher'],
                      'edition'   : pubobject[i]['edition'],
                      'city'      : pubobject[i]['city'],
                      'country'   : pubobject[i]['country'],
                      'doi'       : pubobject[i]['doi']
              };

        break;

      case 5:
        // "Master's Thesis"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
                'state'   : pubobject[i]['state'],
                'country'   : pubobject[i]['country'],
                'city'   : pubobject[i]['city'],
                'school' : pubobject[i]['publisher'],
                'note' : pubobject[i]['note']
              };

        break;

      case 6:
        // "Doctoral Dissertation"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
                'state'   : pubobject[i]['state'],
                'country'   : pubobject[i]['country'],
                'city'   : pubobject[i]['city'],
                'school' : pubobject[i]['publisher'],
                'note' : pubobject[i]['note']
              };

        break;

      case 7:
        // "Authored Report"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
              };

        break;

      case 8:
        // "Edited Report"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
              };

        break;

      case 9:
        // "Other Authored"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
              };

        break;

      case 10: 
        // "Other Edited"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
              };

        break;

      case 11: 
        // "Website"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
              };

        break;

      case 12:
        // "Undergraduate thesis"
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                'title': pubobject[i]['articletitle'],
                'year' : pubobject[i]['year'],
                'booktitle' : pubobject[i]['booktitle'],
                'volume'  : pubobject[i]['volume'],
                'issue'   : pubobject[i]['issue'],
                'pages'   : pubobject[i]['pages'],
                'citation': pubobject[i]['citation'],
              };

        break;

      case 0:
        // Legacy
        pubout[i] = { 'publicationid': pubobject[i]['publicationid'],
                      'title': pubobject[i]['articletitle'],
                      'year' : pubobject[i]['year'],
                      'journal' : pubobject[i]['journal'],
                      'volume'  : pubobject[i]['volume'],
                      'issue'   : pubobject[i]['issue'],
                      'pages'   : pubobject[i]['pages'],
                      'citation': pubobject[i]['citation'],
                      'doi'       : pubobject[i]['doi']
                    };
        break;
    };
  };
  return pubout;
};
