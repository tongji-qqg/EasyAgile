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
// exports.createSprint = function (selfuid, pid, sprintInfo, cb)
// exports.deleteSprint = function(selfuid, pid, sid, cb)
// exports.getSprintListOfProject = function(selfuid, pid, cb)
// exports.getSprintById = function(selfuid, pid, sid, cb)
// exports.modifySprintById = function(selfuid, pid, sid, sprintInfo, cb)
// exports.setSprintState = function (selfuid, pid, sid, state, cb)
//
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');


var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');



////////////////////////////////////////////////////////////////////////////////////////
//
//             functions
//
////////////////////////////////////////////////////////////////////////////////////////
exports.createSprint = function (selfuid, pid, sprintInfo, cb){
	
	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var sprint = new sprintModel(sprintInfo);
	    	sprint.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, targetProject, sprint);
	    	});
	    },

	    function(targetProject, newSprint, callback){	   
	    	
	    	targetProject.sprints.push(newSprint._id);

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, newSprint);
	    	});
	    }	

	], cb);

};

exports.deleteSprint = function(selfuid, pid, sid, cb){

		async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = targetProject.sprints.indexOf(sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);

	    	sprintModel.findById(sid, function(err, sprint){
	    		if(err) return callback(err);	    	
	    		if(!sprint) return callback(errorDef.sprintNotFindError);
	    		sprint.deleted = true;
	    		sprint.save(function(err){
	    			if(err) callback(err);
	    		})
	    	});	    		    			
	    	callback(null)
	    }
	   
	], cb);
};

exports.getSprintListOfProject = function(selfuid, pid, cb){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {
	
			
			projectModel.findOne({'_id':pid})
					    .populate('sprints', '_id name description createTime')					    
					    .exec(function(err, project){
					    	if(err) callback(err);
					    	else callback(null, project.sprints);					    	
					    })			 				
		    			     	
	    }

	], cb);

};

exports.getSprintById = function(selfuid, pid, sid, cb){
	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {
					
			
			sprintModel.findOne({'_id':sid})										    
					    .exec(function(err, sprint){
					    	if(err) callback(err);
					    	else callback(null, sprint);
					    })			 				
		    			     	
	    }

	], cb);
}


exports.modifySprintById = function(selfuid, pid, sid, sprintInfo, cb){
	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = F.getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);
	
			sprintModel.findOneAndUpdate({'_id':sid},{ $set: sprintInfo},function(err){
				if(err) callback(err);
				else callback(null);
			});	 				
		    			     	
	    }

	], cb);
};

exports.setSprintState = function (selfuid, pid, sid, state, cb){
	async.waterfall([

	    function(callback){

			F.indProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = F.getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);
	
			sprintModel.findOneAndUpdate({'_id':sid},{ $set: {state: state}},function(err){
				if(err) callback(err);
				else callback(null);
			});	 				
		    			     	
	    }

	], cb);	
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