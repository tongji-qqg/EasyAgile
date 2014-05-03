var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel = require('../schemas/taskSchema');
var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');


exports.createTask = function(selfuid, pid, sid, taskInfo, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = new taskModel(taskInfo);
	    	task.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, sprint, task);
	    	});
	    },
	    function(sprint, task, callback){
	    	sprint.tasks.push(task._id);
	    	sprint.taskTotal+= 1;
	    	sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null,task);
	       	});
	    }	

	], callback);

};


exports.getTasks = function(selfuid, pid, sid, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprintTasks(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	callback(null, sprint.tasks);
	    }	

	], callback);

};

exports.modifyTaskById = function(selfuid, pid, sid, tid, taskInfo, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = sprint.tasks.id(tid);
	    	if(task == null) return callback(errorDef.notFindError);

	    	task.description = taskInfo.description;
	    	task.level = taskInfo.level;
	    	task.deadline = taskInfo.deadline;

       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};

exports.setTaskProgressById = function(selfuid, pid, sid, tid, progress, callback){

	async.waterfall([
		function(callback){

			if( isNaN(progress))
				return callback(errorDef.progressScopeError);

			if( progress < 0 || progress > 100)
				return callback(errorDef.progressScopeError);

			callback(null);
		},

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = sprint.tasks.id(tid);
	    	if(task == null) return callback(errorDef.notFindError);

	    	task.progress = progress;

       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};


exports.deleteTaskById = function(selfuid, pid, sid, tid, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	taskModel.findByIdAndRemove(tid, function(err){
	    		if(err) return callback(err);
	    	});

	    	sprint.tasks.remove(tid);
	    	

       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};

exports.assignMemberToTask = function(selfuid, pid, sid, tid, uid, callback){

	async.waterfall([		

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){
	    	var exist = false;
	    	var member = targetProject.members.id(uid);
	    	if(member != null) exist = true;
	    	if(targetProject.owner._id.equals(uid)) exist = true;
	    	if(!exist) return callback(errorDef.memberNotFindError);

	    	callback(null, targetProject);
	    },

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

		function(sprint, callback){

			var task = sprint.tasks.id(tid);
			if(task == null) return callback(errorDef.taskNotFindError);

			callback(null, sprint, task);
		},
	    function(sprint, task, callback){	  

	    	var pos = F.getArrayIndexByObjectId(task.executer, uid);
	    	
	    	if(pos != -1) return callback(null);

	    	task.executer.push(uid);
	  
       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};


exports.removeMemberFromTask = function(selfuid, pid, sid, tid, uid, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

		function(sprint, callback){
			
			var task = sprint.tasks.id(tid);
			if(task == null) return callback(errorDef.taskNotFindError);

			callback(null, sprint, task);
		},

	    function(sprint, task, callback){	   
	    	
	    	var pos = F.getArrayIndexByObjectId(task.executer, uid);
	    	if(pos == -1) return callback(null);	    	

	    	task.executer.remove(uid);
	    	
       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};