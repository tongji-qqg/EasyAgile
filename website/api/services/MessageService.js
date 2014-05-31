////////////////////////////////////////////////
////////////////////////////////////////////////
////////////    Message Service     ////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
var async = require('async');

var TYPE = {
	invite_project : 0,
	accept_invite  : 1,
	reject_invite  : 2,
	member_leave   : 3,
	member_remove  : 4,
	project_close  : 5,
	project_delete : 6,
	member_admin   : 7,
	member_group   : 8,
	download_file  : 9,
	publish_topic  : 10,
	assign_task    : 11,
	remove_task    : 12,
	task_delete    : 13,
	project_restart: 14,
};
exports.TYPE = TYPE;

exports.taskChange = function(){}

exports.memberChange = function(){}

exports.sendUserMessage = function(fromUid, toUid, type, message,callback){
	DataService.getUserById(toUid,function(err,user){
		if(err) return callback(err);
		user.alerts.push({
			from: fromUid,
			type: type,
			message: message
		});
		user.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			SocketService.alertUser(toUid);
			callback(null);
		})
	})
}

