function(user, callback) {
	var projects = [];
	var queries = [];
	var makeQuery = function(project) {
		return function(callback) {
			projectModel.findById(project)
				.populate('cSprint', 'taskTotal taskFinish')
				.select('_id name description cSprint createTime owner done')
				.exec(function(err, p) {
					if (err)
						return callback(ErrorService.makeDbErr(err));
					if (p) {
						projects.push(p);
					}
					callback();
				});
		}
	};

	user.projects.forEach(function(c) {
		queries.push(makeQuery(c));
	});

	async.parallel(queries, function(err) {

		if (err) return callback(err);

		else {
			callback(null, projects);
		}
	});
}