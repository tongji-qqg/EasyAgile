
////////////////////////////////////////////////////////////////////////////////////////
//
//            data define 
//
////////////////////////////////////////////////////////////////////////////////////////

var F = require('./functions');

var taskService = require('../service/taskService');

var success = require('../service/errorDefine').success;


////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	/*********************************************************
	 *
	 * for project sprint tasks
	 *
	 */
	////////////////////get tasks of a sprint
	app.get('/API/p/:pid/s/:sid/tasks',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		taskService.getTasks(req.session.user._id, req.params.pid, req.params.sid, function(err, tasks){
			if(err) res.json(err);
			else res.json(F.successWithValue('tasks', tasks));
		});

	});

	////////////////////add a task for a sprint
	app.post('/API/p/:pid/s/:sid/tasks',F.checkUser);	
	app.post('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		taskService.createTask(req.session.user._id, req.params.pid, req.params.sid, {
			title      : req.body.title,
			description: req.body.description,
			deadline   : req.body.deadline,
			level      : req.body.level
		}, function(err, task){
			if(err) res.json(err);
			else res.json(F.successWithValue('task', task));
		});
	});

	////////////////////modify a task for a sprint
	app.put('/API/p/:pid/s/:sid/t/:tid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/t/:tid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		
		taskService.modifyTaskById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, {
			description: req.body.description,
			deadline   : req.body.deadline,
			level      : req.body.level
		}, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
	});

	////////////////////set task progress
	app.put('/API/p/:pid/s/:sid/t/:tid/progress',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/t/:tid/progress',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid/progress, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		
		taskService.setTaskProgressById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, 
			req.body.progress, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
	});

	////////////////////delete a task for a sprint
	app.delete('/API/p/:pid/s/:sid/t/:tid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/t/:tid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/t/:tid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		
		taskService.deleteTaskById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, 
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////assign a task to a member
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid/u/:uid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid + ' uid '+req.params.uid);
		
		taskService.assignMemberToTask(req.session.user._id, req.params.pid, req.params.sid, req.params.tid,
			req.params.uid, function(err){
				if(err) res.json(err);
				else res.json(success);
			});
	});

	////////////////////remove a task from a member
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/t/:tid/u/:uid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid + ' uid '+req.params.uid);
		
		taskService.removeMemberFromTask(req.session.user._id, req.params.pid, req.params.sid, req.params.tid,
			req.params.uid, function(err){
				if(err) res.json(err);
				else res.json(success);
			});
		
	});
};