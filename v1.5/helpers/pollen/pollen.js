function pollen(req, res, next) {
  let db = req.app.locals.db
  // Get the query string:
  var query = {};

  res.status(200)
    .json({
		success: 1,
		status: 'success',
		query: query,
		message: 'Retrieved pollen'
      })
}

module.exports = pollen;
