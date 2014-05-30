/**
 * /api/services/ErrorService.js
 *
 * Generic error service.
 */
"use strict";

var _  = require('underscore');

exports.success = {
	state: "success",
	errorNumber: 0,
};
exports.databaseError = {
	
	state: "error",
	errorNumber: 1,    //may be other numbers
	message: 'database error!'
};
exports.notLoginError = {
	
	state: "error",
	errorNumber: 2,    //may be other numbers
	message: 'you are not login!'
};
exports.alreadyLoginError = {
	
	state: "error",
	errorNumber: 3,    //may be other numbers
	message: 'you are already login!'
};
exports.passwordNotRightError = {
	
	state: "error",
	errorNumber: 4,    //may be other numbers
	message: 'password not ringht!'	
};
exports.projectNotFindError = {
	
	state: "error",
	errorNumber: 5,    //may be other numbers
	message: 'project not find!'
};
exports.userNotFindError = {
	
	state: "error",
	errorNumber: 6,    //may be other numbers
	message: 'user not find!'
};
exports.memberNotFindError = {
	
	state: "error",
	errorNumber: 7,    //may be other numbers
	message: 'member not find!'
};
exports.requirementNotFindError = {
	
	state: "error",
	errorNumber: 8,    //may be other numbers
	message: 'requirement not find!'
};
exports.topicNotFindError = {
	
	state: "error",
	errorNumber: 9,    //may be other numbers
	message: 'topic not find!'
};
exports.sprintNotFindError = {
	
	state: "error",
	errorNumber: 10,    //may be other numbers
	message: 'sprint not find!'
};
exports.commentNotFindError = {
	
	state: "error",
	errorNumber: 11,    //may be other numbers
	message: 'comment not find!'
};
exports.taskNotFindError = {
	
	state: "error",
	errorNumber: 12,    //may be other numbers
	message: 'task not find!'
};
exports.backlogNotFindError = {
	
	state: "error",
	errorNumber: 13,    //may be other numbers
	message: 'Backlog not find!'
};
exports.notFindError = {
	
	state: "error",
	errorNumber: 14,    //may be other numbers
	message: 'not find!'
};
exports.alreadyOwnerError = {
	
	state: "error",
	errorNumber: 15,    //may be other numbers
	message: 'you are already project owner!'
};
exports.alreadyMemberError = {
	
	state: "error",
	errorNumber: 16,    //may be other numbers
	message: 'alreay team member!'
};
exports.cannotRemoveOwnerError = {
	
	state: "error",
	errorNumber: 17,    //may be other numbers
	message: 'project owner can not remove'
};
exports.notOwnerError = {
	
	state: "error",
	errorNumber: 18,    //may be other numbers
	message: 'no do not have owner permission '
};
exports.notAdminError = {
	
	state: "error",
	errorNumber: 19,    //may be other numbers
	message: 'no do not have admin permission '
};
exports.notMemberError = {
	
	state: "error",
	errorNumber: 20,    //may be other numbers
	message: 'no do not have member permission '
};
exports.progressScopeError = {
	
	state: "error",
	errorNumber: 21,    //may be other numbers
	message: 'progress should between 0 and 100'
};
exports.urlError = {
	
	state: "error",
	errorNumber: 22,    //may be other numbers
	message: 'unsupported url'
};
exports.notValidateEmailError = {
	state: "error",
	errorNumber: 23,    //may be other numbers
	message: 'Email not vaildate'	
}
exports.alreadyValidateEmailError = {
	state: "error",
	errorNumber: 24,    //may be other numbers
	message: 'Email already vaildate'	
}
exports.tokenNotMatchError = {
	state: "error",
	errorNumber: 25,    //may be other numbers
	message: 'token not match'	
}
exports.emailFormatError = {
	state: "error",
	errorNumber: 26,    //may be other numbers
	message: 'email format error'	
}
exports.activateLateError = {
	state: "error",
	errorNumber: 27,    //may be other numbers
	message: 'activate late error'	
}
exports.fileNotFindError = {
	state: "error",
	errorNumber: 28,    //may be other numbers
	message: 'file not find error'	
}
exports.wrongURLID = {
	state: "error",
	errorNumber: 29,    //may be other numbers
	message: 'parameter in url not valid'	
}
exports.notHaveChangeTaskPermission = {
	state: "error",
	errorNumber: 30,    //may be other numbers
	message: 'you dont have change task permission'	
}
exports.cannotDeleteCurrentSprint = {
	state: "error",
	errorNumber: 31,    //may be other numbers
	message: 'you cannot delete current sprint!'	
}
exports.projectIsArchived = {
	state: "error",
	errorNumber: 32,    //may be other numbers
	message: 'project is archived'	
}
exports.inviteLinkInvalide = {
	state: "error",
	errorNumber: 33,    //may be other numbers
	message: '邀请链接已失效'	
}
exports.paramRangeError = {
	state: "error",
	errorNumber: 34,    //may be other numbers
	message: '请求范围无效'	
}
exports.successWithValue = function(key, value){

    var s = _.clone(exports.success);
    s[key] = value;
    return s;
};

exports.makeDbErr = function(dbErr){

    var e = _.clone(exports.databaseError);
    e['message'] = dbErr.message;
    e['err'] = dbErr;
    return e;
};