
////////////////////////////////////////////////////////////////////////////////////////
//
//            data define
//
////////////////////////////////////////////////////////////////////////////////////////

var TYPE = {
	b : 'backlogs',	
};

var F = require('./functions');

var backlogService = require('../service/backlogService');

var success = require('../service/errorDefine').success;

////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	/*********************************************************
	 *
	 * for project sprint backlog
	 *
	 */
	////////////////////get backlog of a sprint
	app.get('/API/p/:pid/s/:sid/backlog',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		backlogService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err, backlog){
				
				if(err) res.json(err);
				else res.json(F.successWithValue('backlog', backlog));
		});

	});

	////////////////////add a piece of backlog for a sprint
	app.post('/API/p/:pid/s/:sid/backlog',F.checkUser);	
	app.post('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		backlogService.createOne(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify a piece of backlog for a sprint
	app.put('/API/p/:pid/s/:sid/b/:bid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		
		backlogService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////backlog bulk update
	app.put('/API/p/:pid/s/:sid/b',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/b',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/b, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		backlogService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, req.body.backlog,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a piece of backlog for a sprint
	app.delete('/API/p/:pid/s/:sid/b/:bid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		
		backlogService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete all backlog for a sprint
	app.delete('/API/p/:pid/s/:sid/b',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/b',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/b, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		backlogService.deleteAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});	
};