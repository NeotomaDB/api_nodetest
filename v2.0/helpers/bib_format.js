/** Format Neotoma Publication data and author information.
* @param pubobject A publication object returned as a JSON object from a set of SQL calls.
*/

exports.formatpublbib = function (pubobject) {
  var pubout = [];

  for (var i = 0; i < pubobject.length; i++) {
    var publication = pubobject[i].publication;

    var pubtype = +publication.pubtypeid;

    var authors = publication.author.sort(function (a, b) { return a.order - b.order });

    switch (pubtype) {
      case 1:
        // Journal Articles:

        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'journal': publication.journal,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'doi': publication.doi,
          'authors': authors
        };
        break;
      case 2:

        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'series': publication.seriestitle,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'chapter': publication.chapter,
          'note': publication.note,
          'publisher': publication.publisher,
          'edition': publication.edition,
          'city': publication.city,
          'country': publication.country,
          'doi': publication.doi,
          'authors': authors
        };
        break;

      case 3:
        // "Authored Book"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'series': publication.seriestitle,
          'citation': publication.citation,
          'chapter': publication.chapter,
          'note': publication.note,
          'publisher': publication.publisher,
          'edition': publication.edition,
          'city': publication.city,
          'country': publication.country,
          'doi': publication.doi,
          'authors': authors
        };

        break;

      case 4:
        // "Edited Book"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'series': publication.seriestitle,
          'citation': publication.citation,
          'chapter': publication.chapter,
          'note': publication.note,
          'publisher': publication.publisher,
          'edition': publication.edition,
          'city': publication.city,
          'country': publication.country,
          'doi': publication.doi,
          'authors': authors
        };

        break;

      case 5:
        // "Master's Thesis"
        pubout[i] = { 'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'state': publication.state,
          'country': publication.country,
          'city': publication.city,
          'school': publication.publisher,
          'note': publication.note,
          'authors': authors
        };

        break;

      case 6:
        // "Doctoral Dissertation"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'state': publication.state,
          'country': publication.country,
          'city': publication.city,
          'school': publication.publisher,
          'note': publication.note,
          'authors': authors
        };

        break;

      case 7:
        // "Authored Report"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'authors': authors
        };

        break;

      case 8:
        // "Edited Report"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'authors': authors
        };

        break;

      case 9:
        // "Other Authored"
        pubout[i] = { 'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'authors': authors
        };

        break;

      case 10:
        // "Other Edited"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'authors': authors
        };

        break;

      case 11:
        // "Website"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'authors': authors
        };

        break;

      case 12:
        // "Undergraduate thesis"
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'booktitle': publication.booktitle,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'authors': authors
        };

        break;

      case 0:
        // Legacy
        pubout[i] = {
          'publicationtype': publication.pubtype,
          'publicationid': publication.publicationid,
          'title': publication.articletitle,
          'year': publication.year,
          'journal': publication.journal,
          'volume': publication.volume,
          'issue': publication.issue,
          'pages': publication.pages,
          'citation': publication.citation,
          'doi': publication.doi,
          'authors': authors
        };
        break;
    };

    if (!(publication.datasetid == null)) {
      pubout[i].datasetid = publication.datasetid;
    };
    if (!(publication.siteid == null)) {
      pubout[i].siteid = publication.siteid;
    };
  };

  return pubout;
};
