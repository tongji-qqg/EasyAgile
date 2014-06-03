////////////////////////////////////////////////
////////////////////////////////////////////////
////////////    History Service     ////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
var async = require('async');
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel  =  require('../schemas/taskSchema');
var PROJECT_TYPE = {
	create: 0,               //
	info: 1,                 //
	member_invite_id: 2,        //
	member_invite_e : 3,        //
	member_accept: 4,
	member_remove: 5,        //
	member_leave : 6,        //
	member_admin : 7,        //
	member_normal: 8,        //
	member_group : 9,        //
	group_new    : 10,        //
	group_delete : 11,        //
	editor_new   : 12,       //
	editor_delete: 13,       //
	issue_open   : 14,       //
	issue_close  : 15,       //
	issue_delete : 16,       // not test
	file_upload  : 17,       //
	file_download: 18,       //
	file_delete  : 19,       //
	sprint_new   : 20,       //
	sprint_delete: 21,       //
	sprint_now   : 22,       //
	topic_new    : 23,       //
	topic_delete : 24,       //
	finish       : 25,       //
	del          : 26,       //
	restart      : 27,
};
var SPRINT_TYPE = {
	create: 0,               //
	info: 1,                 //
	backlog_new   : 2,       //
	backlog_delete: 3,       //
	backlog_mod   : 4,       //
	task_new      : 5,       //
	task_delete   : 6        //
}
var TASK_TYPE = {
	create: 0,               //
	info: 1,                 //
	assign    : 2,           //
	remove    : 3,           //
	state     : 4,           //
	progress  : 5,           //
}
exports.PROJECT_TYPE = PROJECT_TYPE;
exports.SPRINT_TYPE  = SPRINT_TYPE;
exports.TASK_TYPE    = TASK_TYPE;

exports.getProjectHistory = function(selfuid, pid, callback){
	DataService.getProjectById(pid, function(err, project){
		if(err) return callback(err);
		userModel.populate(project.history, {path:'who toUser', select:'_id name icon'}, function(err){
			if(err)return callback(ErrorService.makeDbErr(err));
			callback(null,project.history);
		})
	})
}

exports.getProjectHistoryFromTo = function(selfuid, pid, from, to, callback){
	DataService.getProjectById(pid, function(err, project){
		console.log(from);
		console.log(to);
		if(err) return callback(err);
		if(isNaN(from) || isNaN(to))  return callback(ErrorService.paramRangeError);
		if(from < 0 || from > project.history.length) return callback(ErrorService.paramRangeError);
		if(to < 0 )  return callback(ErrorService.paramRangeError);
		userModel.populate(project.history, {path:'who toUser', select:'_id name icon'}, function(err){
			if(err)return callback(ErrorService.makeDbErr(err));
			callback(null,project.history.slice(from,to));
		})
	})
}

exports.getSprintHistory = function(selfuid, pid, sid, callback){
	DataService.getSprintById(sid, function(err, sprint){
		if(err) return callback(err);
		userModel.populate(sprint.history, {path:'who', select:'_id name icon'}, function(err){
			if(err)return callback(ErrorService.makeDbErr(err));
			callback(null,sprint.history);
		})	 
	})
}

exports.getTaskHistory = function(selfuid, pid, sid, tid, callback){
	DataService.getTaskById(tid, function(err, task){
		if(err) return callback(err);
		userModel.populate(task.history, {path:'who toUser', select:'_id name icon'}, function(err){
			if(err)return callback(ErrorService.makeDbErr(err));
			callback(null, task.history);
		})	
	})
}