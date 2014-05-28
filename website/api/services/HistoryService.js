////////////////////////////////////////////////
////////////////////////////////////////////////
////////////    History Service     ////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
var async = require('async');

var PROJECT_TYPE = {
	create: 0,               //
	info: 1,                 //
	member_invite: 2,        //
	member_remove: 3,        //
	member_leave : 4,
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
	create: 0,
	info: 1,
	backlog_new   : 2,
	backlog_delete: 3,
	backlog_mod   : 4,
	task_new      : 5,
	task_delete   : 6
}
var TASK_TYPE = {
	create: 0,
	info: 1,
	time_start: 2,
	time_end  : 3,
	state     : 4,
	progress  : 5,
	executer  : 6
}
exports.PROJECT_TYPE = PROJECT_TYPE;
exports.SPRINT_TYPE  = SPRINT_TYPE;
exports.TASK_TYPE    = TASK_TYPE;