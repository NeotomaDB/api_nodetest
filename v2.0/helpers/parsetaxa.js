exports.parseTaxa = function(taxonString) {

  var name = String(taxonString)
               .toLowerCase()
               .split(",")
               .map(x => x.split("^"))

  var includes = ['simongoring'];
  var drop = ['simongoring'];

  for (var i = 0; i < name.length; i++) {
    if (name[i].length > 1) {
      includes.push(name[i][0])
      name[i].slice(1).map(x => drop.push(x))
    } else {
      includes.push(name[i][0])
    }
  }

  return {'taxa': includes, 'drop': drop};

}
