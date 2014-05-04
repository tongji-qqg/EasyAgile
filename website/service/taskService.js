/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: backlogService.js
//
// Abstract: logic used by backlogRouter
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
// exports.createTask = function(selfuid, pid, sid, taskInfo, callback)
// exports.getTasks = function(selfuid, pid, sid, callback)
// exports.modifyTaskById = function(selfuid, pid, sid, tid, taskInfo, callback)
// exports.setTaskProgressById = function(selfuid, pid, sid, tid, progress, callback)
// exports.deleteTaskById = function(selfuid, pid, sid, tid, callback)
// exports.assignMemberToTask = function(selfuid, pid, sid, tid, uid, callback)
// exports.removeMemberFromTask = function(selfuid, pid, sid, tid, uid, callback)
// 
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel = require('../schemas/taskSchema');
var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');

////////////////////////////////////////////////////////////////////////////////////////
//
//             functions
//
////////////////////////////////////////////////////////////////////////////////////////
exports.createTask = function(selfuid, pid, sid, taskInfo, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = new taskModel(taskInfo);
	    	task.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, sprint, task);
	    	});
	    },
	    function(sprint, task, callback){
	    	sprint.tasks.push(task._id);
	    	sprint.taskTotal+= 1;
	    	sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null,task);
	       	});
	    }	

	], callback);

};


exports.getTasks = function(selfuid, pid, sid, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprintTasks(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	callback(null, sprint.tasks);
	    }	

	], callback);

};

exports.modifyTaskById = function(selfuid, pid, sid, tid, taskInfo, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = sprint.tasks.id(tid);
	    	if(task == null) return callback(errorDef.notFindError);

	    	task.description = taskInfo.description;
	    	task.level = taskInfo.level;
	    	task.deadline = taskInfo.deadline;

       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};

exports.setTaskProgressById = function(selfuid, pid, sid, tid, progress, callback){

	async.waterfall([
		function(callback){

			if( isNaN(progress))
				return callback(errorDef.progressScopeError);

			if( progress < 0 || progress > 100)
				return callback(errorDef.progressScopeError);

			callback(null);
		},

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = sprint.tasks.id(tid);
	    	if(task == null) return callback(errorDef.notFindError);

	    	task.progress = progress;

       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};


exports.deleteTaskById = function(selfuid, pid, sid, tid, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	taskModel.findByIdAndRemove(tid, function(err){
	    		if(err) return callback(err);
	    	});

	    	sprint.tasks.remove(tid);
	    	

       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};

exports.assignMemberToTask = function(selfuid, pid, sid, tid, uid, callback){

	async.waterfall([		

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){
	    	var exist = false;
	    	var member = targetProject.members.id(uid);
	    	if(member != null) exist = true;
	    	if(targetProject.owner._id.equals(uid)) exist = true;
	    	if(!exist) return callback(errorDef.memberNotFindError);

	    	callback(null, targetProject);
	    },

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

		function(sprint, callback){

			var task = sprint.tasks.id(tid);
			if(task == null) return callback(errorDef.taskNotFindError);

			callback(null, sprint, task);
		},
	    function(sprint, task, callback){	  

	    	var pos = F.getArrayIndexByObjectId(task.executer, uid);
	    	
	    	if(pos != -1) return callback(null);

	    	task.executer.push(uid);
	  
       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

};


exports.removeMemberFromTask = function(selfuid, pid, sid, tid, uid, callback){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

		  	F.findSprint(targetProject, sid, callback);		    
		},

		function(sprint, callback){
			
			var task = sprint.tasks.id(tid);
			if(task == null) return callback(errorDef.taskNotFindError);

			callback(null, sprint, task);
		},

	    function(sprint, task, callback){	   
	    	
	    	var pos = F.getArrayIndexByObjectId(task.executer, uid);
	    	if(pos == -1) return callback(null);	    	

	    	task.executer.remove(uid);
	    	
       		sprint.save(function(err){
       			if(err) return callback(err);
       			else callback(null);
       		});
	    }	

	], callback);

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