
exports.formatpublbib = function(pubobject) {
  
  pubout = [];

  for(i = 0; i < pubobject.length; i++) {

    switch(pubobject[i]['PubTypeID']){

      case 0:
        // Legacy
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                      'title': pubobject[i]['ArticleTitle'],
                      'year' : pubobject[i]['Year'],
                      'journal' : pubobject[i]['Journal'],
                      'volume'  : pubobject[i]['Volume'],
                      'issue'   : pubobject[i]['Issue'],
                      'pages'   : pubobject[i]['Pages'],

                      'citation': pubobject[i]['Citation'],
                    };
      case 1:
        // Journal Articles:
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                      'title': pubobject[i]['ArticleTitle'],
                      'year' : pubobject[i]['Year'],
                      'journal' : pubobject[i]['Journal'],
                      'volume'  : pubobject[i]['Volume'],
                      'issue'   : pubobject[i]['Issue'],
                      'pages'   : pubobject[i]['Pages'],
                      'citation': pubobject[i]['Citation'],
                      'doi'       : pubobject[i]['DOI']
                    };
      case 2:
        // Book Chapter
        pubout[i] = { 'publicationid': pubobject[i]['ArticleTitle'],
                      'title': pubobject[i]['ArticleTitle'],
                      'year' : pubobject[i]['Year'],
                      'booktitle' : pubobject[i]['BookTitle'],
                      'volume'  : pubobject[i]['Volume'],
                      'series'  : pubobject[i]['SeriesTitle'],
                      'issue'   : pubobject[i]['Issue'],
                      'pages'   : pubobject[i]['Pages'],
                      'citation': pubobject[i]['Citation'],
                      'chapter' : pubobject[i]['Chapter'],
                      'note' : pubobject[i]['Note'],
                      'publisher' : pubobject[i]['Publisher'],
                      'edition'   : pubobject[i]['Edition'],
                      'city'      : pubobject[i]['City'],
                      'country'   : pubobject[i]['Country'],
                      'doi'       : pubobject[i]['DOI']
                    }; 

      case 3:
        // "Authored Book"
        pubout[i] = { 'publicationid': pubobject[i]['ArticleTitle'],
                      'year' : pubobject[i]['Year'],
                      'booktitle' : pubobject[i]['BookTitle'],
                      'volume'  : pubobject[i]['Volume'],
                      'series'  : pubobject[i]['SeriesTitle'],
                      'citation': pubobject[i]['Citation'],
                      'chapter' : pubobject[i]['Chapter'],
                      'note' : pubobject[i]['Note'],
                      'publisher' : pubobject[i]['Publisher'],
                      'edition'   : pubobject[i]['Edition'],
                      'city'      : pubobject[i]['City'],
                      'country'   : pubobject[i]['Country'],
                      'doi'       : pubobject[i]['DOI']
              };

      case 4:
        // "Edited Book"
        pubout[i] = { 'publicationid': pubobject[i]['ArticleTitle'],
                      'year' : pubobject[i]['Year'],
                      'booktitle' : pubobject[i]['BookTitle'],
                      'volume'  : pubobject[i]['Volume'],
                      'series'  : pubobject[i]['SeriesTitle'],
                      'citation': pubobject[i]['Citation'],
                      'chapter' : pubobject[i]['Chapter'],
                      'note' : pubobject[i]['Note'],
                      'publisher' : pubobject[i]['Publisher'],
                      'edition'   : pubobject[i]['Edition'],
                      'city'      : pubobject[i]['City'],
                      'country'   : pubobject[i]['Country'],
                      'doi'       : pubobject[i]['DOI']
              };

      case 5:
        // "Master's Thesis"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
                'state'   : pubobject[i]['State'],
                'country'   : pubobject[i]['Country'],
                'city'   : pubobject[i]['City'],
                'school' : pubobject[i]['Publisher'],
                'note' : pubobject[i]['Note']
              };

      case 6:
        // "Doctoral Dissertation"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
                'state'   : pubobject[i]['State'],
                'country'   : pubobject[i]['Country'],
                'city'   : pubobject[i]['City'],
                'school' : pubobject[i]['Publisher'],
                'note' : pubobject[i]['Note']
              };

      case 7:
        // "Authored Report"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
              };

      case 8:
        // "Edited Report"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
              };

      case 9:
        // "Other Authored"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
              };

      case 10: 
        // "Other Edited"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
              };

      case 11: 
        // "Website"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
              };

      case 12:
        // "Undergraduate thesis"
        pubout[i] = { 'publicationid': pubobject[i]['PublicationID'],
                'title': pubobject[i]['ArticleTitle'],
                'year' : pubobject[i]['Year'],
                'booktitle' : pubobject[i]['BookTitle'],
                'volume'  : pubobject[i]['Volume'],
                'issue'   : pubobject[i]['Issue'],
                'pages'   : pubobject[i]['Pages'],
                'citation': pubobject[i]['Citation'],
              };

    };
  };
  
  return pubout;
};