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
// exports.createOne = function(selfuid, pid, type, info, cb)
// exports.setAll = function(selfuid, pid, type, info, cb)
// exports.deleteAll = function(selfuid, pid, type, cb)
// exports.getAll = function(selfuid, pid, type, cb)
// exports.modifyOne = function(selfuid, pid, rid, type, info, cb)
// exports.deleteOne = function(selfuid, pid, rid, type, cb)
//
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');


////////////////////////////////////////////////////////////////////////////////////////
//
//             functions
//
////////////////////////////////////////////////////////////////////////////////////////
exports.createOne = function(selfuid, pid, type, info, cb){

	return (function(selfuid, pid, info, cb){
		async.waterfall([

		    function(callback){

				F.findProject(pid, callback);       
		    },

		    function(targetProject, callback){	   

		    	F.checkAdmin(selfuid, targetProject,callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	targetProject[type].push(info);

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);	

	})(selfuid, pid, info, cb);
	
};

exports.setAll = function(selfuid, pid, type, info, cb){

	return (function(selfuid, pid, info, cb){
		async.waterfall([

		    function(callback){

				F.findProject(pid, callback);       
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	targetProject[type] = info;
		    	
		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);

	})(selfuid, pid, info, cb);

};


exports.deleteAll = function(selfuid, pid, type, cb){

	return (function(selfuid, pid, cb){

		async.waterfall([

		    function(callback){
				
				F.findProject(pid, callback);           
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	targetProject[type] = [];

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);
	
	})(selfuid, pid, cb)
	
};

exports.getAll = function(selfuid, pid, type, cb){

	return (function(selfuid, pid, cb){
		async.waterfall([

		    function(callback){
				
				F.findProject(pid, callback);    	        
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkMember(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	callback(null, targetProject[type]);
		    }	

		], cb);
	
	})(selfuid, pid, cb);
	
};

exports.modifyOne = function(selfuid, pid, rid, type, info, cb){

	return (function(selfuid, pid, rid, info, cb){

		async.waterfall([

		    function(callback){

				F.findProject(pid, callback);    	           
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	var r = targetProject[type].id(rid);
		    	if(r == null) return callback(errorDef.notFindError);

		    	r.description = info.description;
		    	r.level = info.level;

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});	    	
		    }	

		], cb);

	})(selfuid, pid, rid, info, cb);
	
};

exports.deleteOne = function(selfuid, pid, rid, type, cb){

	return (function(selfuid, pid, rid, cb){
		
		async.waterfall([

		    function(callback){
				
				F.findProject(pid, callback);    	          
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	var r = targetProject[type].id(rid);
		    	if(r == null) return callback(errorDef.notFindError);

		    	r.remove();
		    	
		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});	    	
		    }	

		], cb);
			
	})(selfuid, pid, rid, cb);
	
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