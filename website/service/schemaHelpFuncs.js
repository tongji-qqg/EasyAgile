/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: backlogService.js
//
// Abstract: logic used by all other services
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
// getArrayIndexByObjectId = function (array, id)
// exports.findProject = function(pid, callback)
// exports.findSprint = function(targetProject, sid, callback)
// exports.findSprintTasks = function(targetProject, sid, callback)
// exports.checkAdmin = function(selfuid, targetProject,callback)
// exports.checkMember = function(selfuid, targetProject,callback
// exports.findUser = function(uid, targetProject, callback)
//
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var errorDef = require('./errorDefine');

var getArrayIndexByObjectId = function (array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].equals(id)) {
            return i;
        }
    }
    return -1;
};

exports.getArrayIndexByObjectId = getArrayIndexByObjectId;

exports.findProject = function(pid, callback){
	projectModel.findById(pid, function(err, result){
				if(err) return callback(errorDef.databaseError);
				if(result == null) callback(errorDef.projectNotFindError);
				else callback(null,result);				
			});
}

exports.findSprint = function(targetProject, sid, callback){
	var pos = getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);

	sprintModel.findById(sid,function(err,sprint){
	           		if(err) return callback(err);
	           		if(sprint == null) callback(errorDef.sprintNotFindError);
	           		else callback(null, sprint)
	           });
}

exports.findSprintTasks = function(targetProject, sid, callback){
	var pos = getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);

	sprintModel.findById(sid)
			   .populate('tasks')
			   .exec(function(err,sprint){
	           		if(err) return callback(err);
	           		if(sprint == null) callback(errorDef.sprintNotFindError);
	           		else callback(null, sprint)
	           });
}

exports.checkAdmin = function(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null && member.isAdmin)
		permissin = true;
	
	if( !permission )return callback(errorDef.notAdminError);	    	
	callback(null, targetProject);
}

exports.checkMember = function(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null)
		permissin = true;
	
	if( !permission )return callback(errorDef.notAdminError);	    	
	callback(null, targetProject);
}

exports.findUser = function(uid, targetProject, callback){
	userModel.findById(uid, function(err, result){
				if(err) return callback(errorDef.databaseError);
				if(result == null) callback(errorDef.userNotFindError);
				else callback(null, targetProject, result);				
			});
}

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