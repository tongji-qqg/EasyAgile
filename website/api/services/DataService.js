/**
 * /api/services/DataService.js
 *
 * Generic data service, which is used to fetch generic data and call defined callback after data fetching.
 * This contains basically all data fetch that Taskboard needs. Services contains fetch of one and multiple
 * objects.
 *
 * Single object fetch:
 *  get{ObjectName}(terms, next, [noExistCheck])
 *
 * Multiple object fetch
 *  get{ObjectName}s(terms, next)
 *
 * All data service methods will write error log if some error occurs. In all cases callback function 'next'
 * is called with two arguments: possible error and actual result.
 *
 * Note that with multiple object fetch service will attach "default" sort conditions for results.
 */

var async = require("async");
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel = require('../schemas/taskSchema');
var topicModel = require('../schemas/topicSchema');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var _  = require('underscore');

var getArrayIndexByObjectId = function (array, id) {
	sails.log.verbose('getArrayIndexByObjectId ' + id);
	try{		
		for (var i = 0; i < array.length; i++) {
	        if (array[i].equals(id)) {
	            return i;
	        }
	    }
	    return -1;
	}catch(e){
		sails.log.verbose('conver id to ObjectId error ' + e);
		return -1;
	}
    
};
exports.getArrayIndexByObjectId = getArrayIndexByObjectId;
/**
 * Service to fetch single project data from database.
 *
 * @param   {Number|{}} where           Used query conditions
 * @param   {Function}  next            Callback function to call after query
 * @param   {Boolean}   [noExistsCheck] If data is not found, skip error
 */
exports.getUserById = function(id, callback) {    

    userModel.findById(id, function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));
		if(result == null) callback(ErrorService.userNotFindError);
		else callback(null,result);
	});

};

exports.getUserWithProject = function(uid, targetProject, callback){
	userModel.findById(uid, function(err, result){
				if(err) return callback(ErrorService.makeDbErr(err));
				if(result == null) callback(ErrorService.userNotFindError);
				else callback(null, targetProject, result);				
			});
}

exports.makeUserInfo = function(u){
	var user = {
		_id : u._id,
		email: u.email,
		name: u.name,
		icon: u.icon
	};
	return user;
}

exports.getUserByEmail = function(email, callback) {    

    userModel.findOne({ 'email' : email }, function(err, result){		
		if(err) 
			callback(ErrorService.makeDbErr(err));
		else if(result == null) 
			callback(ErrorService.userNotFindError);
		else 
			callback(null, result);
	});
};

exports.getProjectById = function(pid, callback){
	
	projectModel.findById(pid)
            .where({'deleted': false})
            .exec(function(err, result){
				if(err) return callback(ErrorService.makeDbErr(err));
				if(result == null) callback(ErrorService.projectNotFindError);
				else callback(null,result);				
			});
}


exports.getProjectInfoById = function(pid, callback){
	
	projectModel.findById(pid)
				.where({'deleted': false})
                .populate('owner','_id name icon')                           
            	.populate('sprints')
            	.populate('topics')
	            .exec(function(err, result){
					if(err) return callback(ErrorService.makeDbErr(err));
					if(result == null) callback(ErrorService.projectNotFindError);
					//else callback(null,result);	
					userModel.populate(result.members, {path:'_id', select:'_id name icon'},function(err){
						if(err) return callback(ErrorService.makeDbErr(err));
						else return callback(null,result);	
					})
				});
}

exports.getProjectTopicsById = function(pid, callback){
	
	projectModel.findById(pid)
				.where({'deleted': false})
                .populate('topics')
	            .exec(function(err, result){
					if(err) return callback(ErrorService.makeDbErr(err));
					if(result == null) callback(ErrorService.projectNotFindError);
					else callback(null,result);	
				});				
}

exports.isSprintInProject = function(project, sid){

	var pos = getArrayIndexByObjectId(project.sprints, sid);
	if(pos == -1) return false;
	else return true;
}

exports.isTaskInSprint = function(sprint, tid){

	var pos = getArrayIndexByObjectId(sprint.tasks, tid);
	if(pos == -1) return false;
	else return true;
}

exports.isSprintInProjectById = function(pid, sid,callback){

	async.waterfall([
		function(callback){
			exports.getProjectById(pid, callback);
		},
		function(project, callback){
			var r = exports.isSprintInProject(project, sid);
			callback(null, r);
		}
	],callback);	
}

exports.getSprintById = function(sid, callback){
	
	sprintModel.findById(sid,function(err,sprint){
	           		if(err) return callback(ErrorService.makeDbErr(err));
	           		if(sprint == null) callback(ErrorService.sprintNotFindError);
	           		else callback(null, sprint)
	});	
}

exports.getTaskById = function(tid, callback){
	taskModel.findById(tid, function(err, task){
	    		if(err) return callback(ErrorService.makeDbErr(err));
	    		if(task == null) return callback(ErrorService.taskNotFindError);
	    		else callback(null,task);
	    	});
}

exports.getTasksInSprint = function(sid, callback){
	
	sprintModel.findById(sid)
			   .populate('tasks')
			   .exec(function(err,sprint){
	           		if(err) return callback(ErrorService.makeDbErr(err));
	           		if(sprint == null) callback(ErrorService.sprintNotFindError);
	           		else callback(null, sprint)
	           });
}

exports.isTaskInSprintById = function(sid, tid,callback){

	async.waterfall([
		function(callback){
			exports.getSprintById(sid, callback);
		},
		function(sprint, callback){
			var r = exports.isTaskInSprint(sprint, tid);
			callback(null, r);
		}
	],callback);	
}

exports.getTopicById = function(tid, callback){
	topicModel.findById(tid, function(err, topic){
	    		if(err) return callback(ErrorService.makeDbErr(err));
	    		if(topic == null) return callback(ErrorService.topicNotFindError);
	    		else callback(null,topic);
	    	});
}

exports.isTopicInProject = function(project, tid){

	var pos = getArrayIndexByObjectId(project.topics, tid);
	if(pos == -1) return false;
	else return true;
}