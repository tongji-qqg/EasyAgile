/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: errorDef.js
//
// Abstract: define all errors may happen in server
// Reference：
//
// Version：1.0
// Author：bryce
// Accomplisheddate：5-3-2014
//
// Replacedversion:
// OriginalAuthor:
// Accomplisheddate:
//
// Mainfunctions：

// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

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

  /*
   * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
   *
   * Copyright 2014 qiqingguo, bryce.qiqi@gmail.com
   *
   * This file is part of EasyAgile
   * EasyAgile is free software: you can redistribute it and/or modify
   * it under the terms of the GNU Lesser General Public License as published by
   * the Free Software Foundation, either version 3 of the License, or
   * (at your option) any later version.
   *
   * Easy is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   * GNU Lesser General Public License for more details.
   *
   * You should have received a copy of the GNU Lesser General Public License
   * along with QBlog.  If not, see <http://www.gnu.org/licenses/>.
   *
   *
   * - Author: qiqingguo
   * - Contact: bryce.qiqi@gmail.com
   * - License: GNU Lesser General Public License (LGPL)
   * - Blog and source code availability: http://cheetah.duapp.com
   */