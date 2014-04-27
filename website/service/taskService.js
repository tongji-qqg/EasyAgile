var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var mongoose = require('mongoose');
var _ = require('underscore');
var ObjectId = mongoose.Schema.Types.ObjectId;

var async = require('async');

var databaseError = {
		message: 'database error!'
	},
	projectNotFindError = {
		message: 'peoject not find!'
	},
	userNotFindError = {
		message: 'user not find!'
	},
	memberNotFindError = {
		message: 'member not find!'
	},
	requirementNotFindError = {
		message: 'requirement not find!'
	},
	topicNotFindError = {
		message: 'topic not find!'
	},
	notFindError = {
		message: 'not find!'
	},
	sprintNotFindError = {
		message: 'sprint not find!'
	},
	commentNotFindError = {
		message: 'comment not find!'
	},
	taskNotFindError = {
		message: 'task not find!'
	},
	alreadyOwnerError = {
		message: 'you are already project owner!'
	},
	alreadyMemberError = {
		message: 'alreay team member!'
	},
	cannotRemoveOwnerError = {
		message: 'project owner can not remove'
	},
	notAdminError = {
		message: 'no do not have admin permission '
	},
	progressScopeError = {
		message: 'progress should between 0 and 100'
	};

Array.prototype.removeByPos = function(from, to) {
	console.log('here');
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var getArrayIndexByObjectId = function (array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].equals(id)) {
            return i;
        }
    }
    return -1;
}

function findProject(pid, callback){
	projectModel.findById(pid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(projectNotFindError);
				else callback(null,result);				
			});
}

function findSprint(targetProject, sid, callback){
	var pos = getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(sprintNotFindError);

	sprintModel.findById(sid,function(err,sprint){
	           		if(err) return callback(err);
	           		if(sprint == null) callback(sprintNotFindError);
	           		else callback(null, sprint)
	           });
}

function checkAdmin(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner._id.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null && member.isAdmin)
		permissin = true;
	
	if( !permission )return callback(notAdminError);	    	
	callback(null, targetProject);
}

function checkMember(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner._id.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null)
		permissin = true;
	
	if( !permission )return callback(notAdminError);	    	
	callback(null, targetProject);
}

exports.createTask = function(selfuid, pid, sid, taskInfo, callback){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	sprint.tasks.push(taskInfo);
	    	sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null);
	       		});
	    }	

	], callback);

};


exports.getTasks = function(selfuid, pid, sid, callback){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	callback(null, sprint.tasks);
	    }	

	], callback);

};

exports.modifyTaskById = function(selfuid, pid, sid, tid, taskInfo, callback){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = sprint.tasks.id(tid);
	    	if(task == null) return callback(notFindError);

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
				return callback(progressScopeError);

			if( progress < 0 || progress > 100)
				return callback(progressScopeError);

			callback(null);
		},

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = sprint.tasks.id(tid);
	    	if(task == null) return callback(notFindError);

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

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = sprint.tasks.id(tid);
	    	if(task == null) return callback(notFindError);

	    	task.remove();

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

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){
	    	var exist = false;
	    	var member = targetProject.members.id(uid);
	    	if(member != null) exist = true;
	    	if(targetProject.owner._id.equals(uid)) exist = true;
	    	if(!exist) return callback(memberNotFindError);

	    	callback(null, targetProject);
	    },

	    function(targetProject, callback) {

		  	findSprint(targetProject, sid, callback);		    
		},

		function(sprint, callback){
			var task = sprint.tasks.id(tid);
			if(task == null) return callback(taskNotFindError);

			callback(null, sprint, task);
		},
	    function(sprint, task, callback){	  

	    	var pos = getArrayIndexByObjectId(task.executer, uid);
	    	
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

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	findSprint(targetProject, sid, callback);		    
		},

		function(sprint, callback){
			var task = sprint.tasks.id(tid);
			if(task == null) return callback(taskNotFindError);

			callback(null, sprint, task);
		},

	    function(sprint, task, callback){	   
	    	
	    	var pos = getArrayIndexByObjectId(task.executer, uid);
	    	if(pos == -1) return callback(null);	    	

	    	task.executer.remove(uid);
	    	
       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};