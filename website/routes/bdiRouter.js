
var F = require('./functions');

var bdiService = require('../service/bdiService');

////////////////////////////////////////////////////////////////////////////////////////
//
//            data define just fot development
//
////////////////////////////////////////////////////////////////////////////////////////

var TYPE = {
	b : 'backlogs',
	d : 'defects',
	i : 'issues'	
};


var success = {
	state: "success",
	errorNUmber: 0,   //always 0	
};

var error = {
	state: "error",
	errorNumber: 1,    //may be other numbers
	message: "error message"
};



module.exports = function(app){

	/*********************************************************
	 *
	 * for project sprint backlog
	 *
	 */
	////////////////////get backlog of a sprint
	app.get('/API/p/:pid/s/:sid/backlog',F.checkUser);
	app.get('/API/p/:pid/s/:sid/backlog',F.checkProjectMember);
	app.get('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err, backlog){
			if(err) res.json(err);
			else res.json(backlog);
		});

	});

	////////////////////add a piece of backlog for a sprint
	app.post('/API/p/:pid/s/:sid/backlog',F.checkUser);
	app.post('/API/p/:pid/s/:sid/backlog',F.checkProjectAdmin);
	app.post('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.createOne(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify a piece of backlog for a sprint
	app.put('/API/p/:pid/s/:sid/b/:bid',F.checkUser);
	app.put('/API/p/:pid/s/:sid/b/:bid',F.checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		
		bdiService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////backlog bulk update
	app.put('/API/p/:pid/s/:sid/b',F.checkUser);
	app.put('/API/p/:pid/s/:sid/b',F.checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/b',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/b, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, req.body.backlog,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a piece of backlog for a sprint
	app.delete('/API/p/:pid/s/:sid/b/:bid',F.checkUser);
	app.delete('/API/p/:pid/s/:sid/b/:bid',F.checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		
		bdiService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete all backlog for a sprint
	app.delete('/API/p/:pid/s/:sid/b',F.checkUser);
	app.delete('/API/p/:pid/s/:sid/b',F.checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/b',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/b, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.deleteAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	/*********************************************************
	*
	* for project sprint defects
	*
	*/
	////////////////////get defects of a sprint
	app.get('/API/p/:pid/s/:sid/defects',F.checkUser);
	app.get('/API/p/:pid/s/:sid/defects',F.checkProjectMember);
	app.get('/API/p/:pid/s/:sid/defects',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/defects, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.d, 
			function(err, result){
			if(err) res.json(err);
			else res.json(result);
		});

	});

	////////////////////add a defect for a sprint
	app.post('/API/p/:pid/s/:sid/defects',F.checkUser);
	app.post('/API/p/:pid/s/:sid/defects',F.checkProjectAdmin);
	app.post('/API/p/:pid/s/:sid/defects',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/defects, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.createOne(req.session.user._id, req.params.pid, req.params.sid, TYPE.d, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify defect for a sprint
	app.put('/API/p/:pid/s/:sid/d/:did',F.checkUser);
	app.put('/API/p/:pid/s/:sid/d/:did',F.checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/d/:did',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/d/:did, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' did = ' + req.params.did);
		
		bdiService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.d, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify defect for a sprint
	app.put('/API/p/:pid/s/:sid/d',F.checkUser);
	app.put('/API/p/:pid/s/:sid/d',F.checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/d',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/d, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.d, req.body.backlog,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete defect for a sprint
	app.delete('/API/p/:pid/s/:sid/d/:did',F.checkUser);
	app.delete('/API/p/:pid/s/:sid/d/:did',F.checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/d/:did',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/d/:did, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' did = ' + req.params.did);
		
		bdiService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.d,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete All defect for a sprint
	app.delete('/API/p/:pid/s/:sid/d',F.checkUser);
	app.delete('/API/p/:pid/s/:sid/d',F.checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/d',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/d, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.deleteAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err){
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
	app.get('/API/p/:pid/s/:sid/issues',F.checkProjectMember);
	app.get('/API/p/:pid/s/:sid/issues',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/issues, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, 
			function(err, result){
			if(err) res.json(err);
			else res.json(result);
		});

	});

	////////////////////add a issue for a sprint
	app.post('/API/p/:pid/s/:sid/issues',F.checkUser);
	app.post('/API/p/:pid/s/:sid/issues',F.checkProjectAdmin);
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
	app.put('/API/p/:pid/s/:sid/i/:iid',F.checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		
		bdiService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.i, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify a issue for a sprint
	app.put('/API/p/:pid/s/:sid/i',F.checkUser);
	app.put('/API/p/:pid/s/:sid/i',F.checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/i',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/i, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, req.body.backlog,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a issue for a sprint
	app.delete('/API/p/:pid/s/:sid/i/:iid',F.checkUser);
	app.delete('/API/p/:pid/s/:sid/i/:iid',F.checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		
		bdiService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.i,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a issue for a sprint
	app.delete('/API/p/:pid/s/:sid/i',F.checkUser);
	app.delete('/API/p/:pid/s/:sid/i',F.checkProjectAdmin);
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