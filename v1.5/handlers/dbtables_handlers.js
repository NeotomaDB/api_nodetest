module.exports = {
  dbtables: function (req, res, next) { 
    var dbtable = require('../helpers/dbtables/dbtables.js');
    dbtable.dbtables(req, res, next);
  }
};
