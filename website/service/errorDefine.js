exports.success = {
	state: "success",
	errorNumber: 0,
};
exports.databaseError = {
	
	state: "error",
	errorNumber: 1,    //may be other numbers
	message: 'database error!'
};
exports.projectNotFindError = {
	
	state: "error",
	errorNumber: 2,    //may be other numbers
	message: 'peoject not find!'
};
exports.userNotFindError = {
	
	state: "error",
	errorNumber: 3,    //may be other numbers
	message: 'user not find!'
};
exports.memberNotFindError = {
	
	state: "error",
	errorNumber: 4,    //may be other numbers
	message: 'member not find!'
};
exports.requirementNotFindError = {
	
	state: "error",
	errorNumber: 5,    //may be other numbers
	message: 'requirement not find!'
};
exports.topicNotFindError = {
	
	state: "error",
	errorNumber: 6,    //may be other numbers
	message: 'topic not find!'
};
exports.notFindError = {
	
	state: "error",
	errorNumber: 7,    //may be other numbers
	message: 'not find!'
};
exports.sprintNotFindError = {
	
	state: "error",
	errorNumber: 8,    //may be other numbers
	message: 'sprint not find!'
};
exports.commentNotFindError = {
	
	state: "error",
	errorNumber: 9,    //may be other numbers
	message: 'comment not find!'
};
exports.taskNotFindError = {
	
	state: "error",
	errorNumber: 10,    //may be other numbers
	message: 'task not find!'
};
exports.alreadyOwnerError = {
	
	state: "error",
	errorNumber: 11,    //may be other numbers
	message: 'you are already project owner!'
};
exports.alreadyMemberError = {
	
	state: "error",
	errorNumber: 12,    //may be other numbers
	message: 'alreay team member!'
};
exports.cannotRemoveOwnerError = {
	
	state: "error",
	errorNumber: 13,    //may be other numbers
	message: 'project owner can not remove'
};
exports.notAdminError = {
	
	state: "error",
	errorNumber: 13,    //may be other numbers
	message: 'no do not have admin permission '
};
exports.progressScopeError = {
	
	state: "error",
	errorNumber: 14,    //may be other numbers
	message: 'progress should between 0 and 100'
};
exports.urlError = {
	
	state: "error",
	errorNumber: 15,    //may be other numbers
	message: 'unsupported url'
};
exports.notLoginError = {
	
	state: "error",
	errorNumber: 16,    //may be other numbers
	message: 'you are not login!'
};
exports.passwordNotRightError = {
	
	state: "error",
	errorNumber: 17,    //may be other numbers
	message: 'password not ringht!'	
};
Array.prototype.removeByPos = function(from, to) {
	console.log('here');
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};