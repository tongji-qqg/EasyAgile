
var F = require('./functions');

var taskService = require('../service/taskService');

////////////////////////////////////////////////////////////////////////////////////////
//
//            data define just fot development
//
////////////////////////////////////////////////////////////////////////////////////////
var user = {
	id:1,
	name:"avoid",
	email:"bryce.qiqi@gmail.com",
	password:"whoami",           //put it here just for dev
	icon:"img/login/logo.png"
};

var messageList = [
	{id:1, message:"hello world!",read:false},
	{id:2, message:"hello tongji!",read:false}
];

var topicList = [
	{id:1,title:"title~~",author:1,date:new Date},
	{id:2,title:"title!!",author:1,date:new Date}
];

var sprintList = [
	{id:1,startTime:new Date,endTime:new Date,realEndTime:new Date,done:true},
	{id:2,startTime:new Date,endTime:new Date,realEndTime:null,done:false},
];

var sprint = {
	id:2,
	startTime:new Date,
	endTime:new Date,
	realEndTime:null,
	done:false,
	backlog:[
		{id:1,des:"user login",level:1},
		{id:2,des:"user register",level:1},
		{id:3,des:"user logout",level:1},
	],
	defects:[
		{id:1,des:"user login fail in IE",level:1}
	],
	issues:[
		{id:1,des:"UI prototype not finish!!"}
	],
	tasks:[
		{
			id:1,des:"server side user login",level:1,deadline:new Date,done:false,progress:20,
			executer:[{id:1,name:'avoid'}]
		},
		{
			id:2,des:"front side html user login",level:1,deadline:new Date,done:false,progress:90,
			executer:[{id:2,name:'yangfan'}]
		},
	]
};

var topic = {
	id:1,
	title:"title~~",
	author:1,
	date:new Date,
	body:"hahahahahahhahahahah~~",
	comments:[
		{id:1,body:"test comment",date:new Date,owner:{id:1,name:'avoid'}}
	]
}

var userList = [user,user];

var project = {
	name: "project",
	startDate: new Date,
	des:"project des"
};

var requireList = [
	{id:1,descripton:"require 1 des",level:2},
	{id:2,descripton:"require 2 des",level:3}
];

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
	 * for project sprint tasks
	 *
	 */
	////////////////////get tasks of a sprint
	app.get('/API/p/:pid/s/:sid/tasks',F.checkUser);
	app.get('/API/p/:pid/s/:sid/tasks',F.checkProjectMember);
	app.get('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		taskService.getTasks(req.session.user._id, req.params.pid, req.params.sid, function(err, tasks){
			if(err) res.json(err);
			else res.json(tasks);
		});

	});

	////////////////////add a task for a sprint
	app.post('/API/p/:pid/s/:sid/tasks',F.checkUser);
	app.post('/API/p/:pid/s/:sid/tasks',F.checkProjectAdmin);
	app.post('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		taskService.createTask(req.session.user._id, req.params.pid, req.params.sid, {
			description: req.body.description,
			deadline   : req.body.deadline,
			level      : req.body.level
		}, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
	});

	////////////////////modify a task for a sprint
	app.put('/API/p/:pid/s/:sid/t/:tid',F.checkUser);
	app.put('/API/p/:pid/s/:sid/t/:tid',F.checkProjectAdmin);
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
	app.put('/API/p/:pid/s/:sid/t/:tid/progress',F.checkProjectAdmin);
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
	app.delete('/API/p/:pid/s/:sid/t/:tid',F.checkProjectAdmin);
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
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',F.checkProjectAdmin);
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
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',F.checkProjectAdmin);
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