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
// exports.createOne = function(selfuid, pid, sid, type, info, callback)
// exports.modifyOne = function(selfuid, pid, sid, rid, type, info, callback)
// exports.getAll    = function(selfuid, pid, sid, type, callback)
// exports.setAll    = function(selfuid, pid, sid, type, info, callback)
// exports.deleteOne = function(selfuid, pid, sid, rid, type, callback)
// exports.deleteAll = function(selfuid, pid, sid, type, callback)
//
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');


var async = require('async');

var errorDef = require('./errorDefine');

var F  = require('./schemaHelpFuncs');

////////////////////////////////////////////////////////////////////////////////////////
//
//             function
//
////////////////////////////////////////////////////////////////////////////////////////

//type in [backlogs, defects, issues]
exports.createOne = function(selfuid, pid, sid, type, info, callback){

	return (function(selfuid, pid, sid, info, callback){

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

		    	sprint[type].push(info);
	       		sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null);
	       		});
		    }	

		], callback);

	})(selfuid, pid, sid, info, callback);
}

exports.modifyOne = function(selfuid, pid, sid, rid, type, info, callback){

	return (function(selfuid, pid, sid, rid, info, callback){

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

		    	var target = sprint[type].id(rid);
		    	if(target == null) return callback(errorDef.notFindError);

		    	target.description = info.description;
		    	target.level = info.level;

	       		sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null);
	       		});
		    }	

		], callback);

	})(selfuid, pid, sid, rid, info, callback);
}

exports.getAll = function(selfuid, pid, sid, type, callback){

	return (function(selfuid, pid, sid, callback){

		async.waterfall([

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

		    	callback(null, sprint[type]);
		    }	

		], callback);

	})(selfuid, pid, sid, callback);
}
exports.setAll = function(selfuid, pid, sid, type, info, callback){

	return (function(selfuid, pid, sid, info, callback){

		async.waterfall([

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

		    	sprint[type] = info;
	    	
		    	sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], callback);

	})(selfuid, pid, sid, info, callback);
}

exports.deleteOne = function(selfuid, pid, sid, rid, type, callback){

	return (function(selfuid, pid, sid, rid, callback){

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

		    	var target = sprint[type].id(rid);
		    	if(target == null) return callback(errorDef.notFindError); 	
				
				target.remove();
				sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
	    		});	    			    	
		    }	

		], callback);

	})(selfuid, pid, sid, rid, callback);
}

exports.deleteAll = function(selfuid, pid, sid, type, callback){

	return (function(selfuid, pid, sid, callback){

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

		    	sprint[type] = [];
		    	sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
	    		});	

		    }	

		], callback);

	})(selfuid, pid, sid, callback);
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