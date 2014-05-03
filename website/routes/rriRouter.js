


////////////////////////////////////////////////////////////////////////////////////////
//
//            data define
//
////////////////////////////////////////////////////////////////////////////////////////

var F = require('./functions');

var rrService = require('../service/rriService');

var success = require('../service/errorDefine').success;



////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){


	/*********************************************************
	 *
	 * project requirements basic APIs	
	 *
	 */
	////////////////////get require list of a project
	app.get('/API/p/:pid/r',F.checkUser);
	app.get('/API/p/:pid/r',function(req,res){
		console.log('request get: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.getAllRequirements(req.session.user._id, req.params.pid, function(err,result){
			if(err) res.json(err);
			else res.json(F.successWithValue('requirements', result));
		});

	});

	////////////////////delete all requirements of a project
	app.delete('/API/p/:pid/r',F.checkUser);
	app.delete('/API/p/:pid/r',function(req,res){
		console.log('request delete: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.deleteAllRequirements(req.session.user._id, req.params.pid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////add a requirement of a project
	app.post('/API/p/:pid/r',F.checkUser);
	app.post('/API/p/:pid/r',function(req,res){
		console.log('request post: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.addaRequirement(req.session.user._id, req.params.pid, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////bulk update
	app.put('/API/p/:pid/r',F.checkUser);
	app.put('/API/p/:pid/r',function(req,res){
		console.log('request put: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.setRequirements(req.session.user._id, req.params.pid, req.body.requirements, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////modify a requirement of a project
	app.put('/API/p/:pid/r/:rid',F.checkUser);
	app.put('/API/p/:pid/r/:rid',function(req,res){
		console.log('request put: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);
		
		rrService.modifyRequirementById(req.session.user._id, req.params.pid, req.params.rid, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a requirement of a project
	app.delete('/API/p/:pid/r/:rid',F.checkUser);
	app.delete('/API/p/:pid/r/:rid',function(req,res){
		console.log('request delete: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);

		rrService.deleteRequirementById(req.session.user._id, req.params.pid, req.params.rid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});




	/*********************************************************
	 *
	 * for project sprint issues
	 *
	 */
	////////////////////get issues of a sprint
	app.get('/API/p/:pid/s/:sid/issues',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/issues',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/issues, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, 
			function(err, result){
				
				if(err) res.json(err);
				else res.json(F.successWithValue('issues', result));
		});

	});

	////////////////////add a issue for a sprint
	app.post('/API/p/:pid/s/:sid/issues',F.checkUser);	
	app.post('/API/p/:pid/s/:sid/issues',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/issues, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.createOne(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify a issue for a sprint
	app.put('/API/p/:pid/s/:sid/i/:iid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		
		bdiService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.iid, TYPE.i, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify a issue for a sprint
	app.put('/API/p/:pid/s/:sid/i',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/i',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/i, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, req.body.issues,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a issue for a sprint
	app.delete('/API/p/:pid/s/:sid/i/:iid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		
		bdiService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.iid, TYPE.i,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a issue for a sprint
	app.delete('/API/p/:pid/s/:sid/i',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/i',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/i, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.deleteAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, 
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

};