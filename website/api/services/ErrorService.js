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
	message: '抱歉，您没有登录'
};
exports.alreadyLoginError = {
	
	state: "error",
	errorNumber: 3,    //may be other numbers
	message: '抱歉，您已经登录'
};
exports.passwordNotRightError = {
	
	state: "error",
	errorNumber: 4,    //may be other numbers
	message: '密码错误'	
};
exports.projectNotFindError = {
	
	state: "error",
	errorNumber: 5,    //may be other numbers
	message: '抱歉，项目没有找到'
};
exports.userNotFindError = {
	
	state: "error",
	errorNumber: 6,    //may be other numbers
	message: '抱歉，用户没有找到'
};
exports.memberNotFindError = {
	
	state: "error",
	errorNumber: 7,    //may be other numbers
	message: '抱歉，成员没有找到'
};
exports.requirementNotFindError = {
	
	state: "error",
	errorNumber: 8,    //may be other numbers
	message: '抱歉，需求没有找到'
};
exports.topicNotFindError = {
	
	state: "error",
	errorNumber: 9,    //may be other numbers
	message: '抱歉，话题没有找到'
};
exports.sprintNotFindError = {
	
	state: "error",
	errorNumber: 10,    //may be other numbers
	message: '抱歉，Sprint没有找到'
};
exports.commentNotFindError = {
	
	state: "error",
	errorNumber: 11,    //may be other numbers
	message: '抱歉，评论没有找到'
};
exports.taskNotFindError = {
	
	state: "error",
	errorNumber: 12,    //may be other numbers
	message: '抱歉，任务没有找到'
};
exports.backlogNotFindError = {
	
	state: "error",
	errorNumber: 13,    //may be other numbers
	message: '抱歉，Backlog没有找到'
};
exports.notFindError = {
	
	state: "error",
	errorNumber: 14,    //may be other numbers
	message: '抱歉，没有找到'
};
exports.alreadyOwnerError = {
	
	state: "error",
	errorNumber: 15,    //may be other numbers
	message: '抱歉，已经是项目的所有者了'
};
exports.alreadyMemberError = {
	
	state: "error",
	errorNumber: 16,    //may be other numbers
	message: '抱歉，您已经是项目的成员了'
};
exports.cannotRemoveOwnerError = {
	
	state: "error",
	errorNumber: 17,    //may be other numbers
	message: '抱歉，项目拥有者无法被移除'
};
exports.notOwnerError = {
	
	state: "error",
	errorNumber: 18,    //may be other numbers
	message: '抱歉，您没有项目所有者权限'
};
exports.notAdminError = {
	
	state: "error",
	errorNumber: 19,    //may be other numbers
	message: '抱歉，您没有项目管理员权限'
};
exports.notMemberError = {
	
	state: "error",
	errorNumber: 20,    //may be other numbers
	message: '抱歉，您没有项目成员权限'
};
exports.progressScopeError = {
	
	state: "error",
	errorNumber: 21,    //may be other numbers
	message: '抱歉，进度应该在0到100之间'
};
exports.urlError = {
	
	state: "error",
	errorNumber: 22,    //may be other numbers
	message: '抱歉，url没有找到'
};
exports.notValidateEmailError = {
	state: "error",
	errorNumber: 23,    //may be other numbers
	message: '抱歉，该邮箱未验证'	
}
exports.alreadyValidateEmailError = {
	state: "error",
	errorNumber: 24,    //may be other numbers
	message: '抱歉，该邮箱已经验证'	
}
exports.tokenNotMatchError = {
	state: "error",
	errorNumber: 25,    //may be other numbers
	message: '抱歉，验证码不匹配'	
}
exports.emailFormatError = {
	state: "error",
	errorNumber: 26,    //may be other numbers
	message: '抱歉，邮箱格式错误'	
}
exports.activateLateError = {
	state: "error",
	errorNumber: 27,    //may be other numbers
	message: '抱歉，邮箱验证码期限已过'	
}
exports.fileNotFindError = {
	state: "error",
	errorNumber: 28,    //may be other numbers
	message: '抱歉，文件没有找到'	
}
exports.wrongURLID = {
	state: "error",
	errorNumber: 29,    //may be other numbers
	message: '抱歉，URL参数错误'	
}
exports.notHaveChangeTaskPermission = {
	state: "error",
	errorNumber: 30,    //may be other numbers
	message: '抱歉，您没有修改任务的权限'	
}
exports.cannotDeleteCurrentSprint = {
	state: "error",
	errorNumber: 31,    //may be other numbers
	message: '抱歉，您没不能删除当前Sprint'	
}
exports.projectIsArchived = {
	state: "error",
	errorNumber: 32,    //may be other numbers
	message: '抱歉，这个项目已经归档'	
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
exports.missInfoError = {
	state: "error",
	errorNumber: 35,    //may be other numbers
	message: '抱歉，缺少必要的信息'	
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