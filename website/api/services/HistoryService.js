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
	member_invite: 2,        //
	member_remove: 3,        //
	member_leave : 4,        //
	member_admin : 5,        //
	member_normal: 6,        //
	member_group : 7,        //
	group_new    : 8,        //
	group_delete : 9,        //
	editor_new   : 10,       //
	editor_delete: 11,       //
	issue_open   : 12,       //
	issue_close  : 13,       //
	issue_delete : 14,       // not test
	file_upload  : 15,       //
	file_download: 16,       //
	file_delete  : 17,       //
	sprint_new   : 18,       //
	sprint_delete: 19,       //
	sprint_now   : 20,       //
	topic_new    : 21,       //
	topic_delete : 22,       //
	finish       : 23,       //
	del          : 24        //
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