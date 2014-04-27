var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var mongoose = require('mongoose');

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

////////////////////////////////////////////////////////////////////////////////////////
//
//            createor function
//
////////////////////////////////////////////////////////////////////////////////////////

//type in [backlogs, defects, issues]
exports.createOne = function(selfuid, pid, sid, type, info, callback){

	return (function(selfuid, pid, sid, info, callback){

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

		    	sprint[type].push(info);
	       		sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null);
	       		});
		    }	

		], callback);

	})(selfuid, pid, sid, info, callback);
}

exports.modifyOne = function(selfuid, pid, sid, rid, type, info, callback){

	return (function(selfuid, pid, sid, rid, info, callback){

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

		    	var target = sprint[type].id(rid);
		    	if(target == null) return callback(notFindError);

		    	target.description = info.description;
		    	target.level = info.level;

	       		sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null);
	       		});
		    }	

		], callback);

	})(selfuid, pid, sid, rid, info, callback);
}

exports.getAll = function(selfuid, pid, sid, type, callback){

	return (function(selfuid, pid, sid, callback){

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

		    	callback(null, sprint[type]);
		    }	

		], callback);

	})(selfuid, pid, sid, callback);
}
exports.setAll = function(selfuid, pid, sid, type, info, callback){

	return (function(selfuid, pid, sid, info, callback){

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

		    	sprint[type] = info;
	    	
		    	sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], callback);

	})(selfuid, pid, sid, info, callback);
}

exports.deleteOne = function(selfuid, pid, sid, rid, type, callback){

	return (function(selfuid, pid, sid, rid, callback){

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

		    	var target = sprint[type].id(rid);
		    	if(target == null) return callback(notFindError); 	
				
				target.remove();
				sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
	    		});	    			    	
		    }	

		], callback);

	})(selfuid, pid, sid, rid, callback);
}

exports.deleteAll = function(selfuid, pid, sid, type, callback){

	return (function(selfuid, pid, sid, callback){

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

		    	sprint[type] = [];
		    	sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
	    		});	

		    }	

		], callback);

	})(selfuid, pid, sid, callback);
}