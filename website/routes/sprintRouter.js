
////////////////////////////////////////////////////////////////////////////////////////
//
//            data define 
//
////////////////////////////////////////////////////////////////////////////////////////

var success = require('../service/errorDefine').success;

var F = require('./functions');

var sprintService = require('../service/sprintService');


////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	/*********************************************************
	 *
	 * for project sprint
	 *
	 */
	////////////////////get all sprint brief description as a list
	app.get('/API/p/:pid/s',F.checkUser);	
	app.get('/API/p/:pid/s',function(req,res){
		console.log('request get: /API/p/:pid/s, pid = '+ req.params.pid);
		
		sprintService.getSprintListOfProject(req.session.user._id, req.params.pid, function(err, sprints){
			if(err) res.json(err);
			else res.json(F.successWithValue('sprints', sprints));
		})
	});

	////////////////////get a detail sprint information
	app.get('/API/p/:pid/s/:sid',F.checkUser);	
	app.get('/API/p/:pid/s/:sid',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.getSprintById(req.session.user._id, req.params.pid, req.params.sid, 
			function(err, sprint){
			if(err) res.json(err);
			else res.json(F.successWithValue('sprint', sprint));
		})

	});

	////////////////////new a sprint of a project
	app.post('/API/p/:pid/s',F.checkUser);	
	app.post('/API/p/:pid/s',function(req,res){
		console.log('request post: /API/p/:pid/s, pid = '+ req.params.pid);

		var sprintInfo = {
			name: req.body.name,
			description: req.body.description,
		};
		if(req.body.endTime) sprintInfo.endTime = req.body.endTime;
		sprintService.createSprint(req.session.user._id, req.params.pid, sprintInfo,function(err){
			if(err) res.json(err);
			else res.json(success);
		});		

	});

	////////////////////delete a sprint of a project
	app.delete('/API/p/:pid/s/:sid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);

		sprintService.deleteSprint(req.session.user._id, req.params.pid, req.params.sid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});		
	
	});

	////////////////////modify basic info of a sprint of a project
	app.put('/API/p/:pid/s/:sid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.modifySprintById(req.session.user._id, req.params.pid, req.params.sid, {
			name: req.body.name,
			description: req.body.description
		}, function(err){
			if(err) res.json(err);
			else res.json(success);
		});		

	});

	////////////////////start a sprint of a project
	app.get('/API/p/:pid/s/:sid/start',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/start',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/start, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.setSprintState(req.session.user._id, req.params.pid, req.params.sid, 1, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////finish a sprint of a project
	app.get('/API/p/:pid/s/:sid/finish',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/finish',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/finish, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.setSprintState(req.session.user._id, req.params.pid, req.params.sid, 2, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});
};