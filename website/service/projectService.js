/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: projectService.js
//
// Abstract: logic used by projectRouter
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
// exports.createProject       = function(selfuid, name, des, cb)
// exports.findProjectInfoById = function(selfuid, pid, callback)
// exports.updateProjectInfo   = function(selfuid, pid, toProject, cb)
// exports.finishProject       = function(selfuid, pid, cb)
// exports.addMemberById       = function(selfuid, pid, uid, cb)
// exports.removeMemberById    = function(selfuid,pid, uid, cb)
// exports.setAdmin            = function(selfuid, pid, uid, bSet, cb)
//
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var sprintService = require('./sprintService');
var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');

////////////////////////////////////////////////////////////////////////////////////////
//
//             functions
//
////////////////////////////////////////////////////////////////////////////////////////
exports.createProject = function(selfuid, name, des, cb){
	
	async.waterfall([

		function(callback){
			userModel.findById(selfuid, function(err, result){
				if(err) return callback(err);
				if(result == null) callback(errorDef.userNotFindError);
				else callback(null,result);
			});			
		},

		function(user, callback){
			var sprint = new sprintModel();
			var project = new projectModel({
				name: name,
				description: des,
				owner: selfuid		
			});
			project.save(function(err){
				if(err) callback(err);
				else callback(null, user, project);
			});		
		},

		function(user, project, callback){			
			user.projects.push(project._id);
			user.save(function(err){
				if(err) callback(err);//not deal project!
				else callback(null, user, project);
			});
		},

		function(user, project, callback){
			sprintService.createSprint(selfuid, project._id, {
				name: 'sprint 1',
				description: 'first sprint'
			}, function(err, result){
				if(err) callback(err);
				else{ 
					project.cSprint = result._id;
					project.save(function(err){
						if(err) callback(err);
						else callback(null, project);
					})					
				}
			});
		}

	],cb);	
};



exports.findProjectInfoById = function(selfuid, pid, callback) {

	async.waterfall([
	    
	    function(callback){
			F.findProject(pid, callback);     
	    },

	    function(targetProject, callback){	   
	    	
	    	F.checkMember(selfuid,targetProject,callback);
	    },	

	    function(targetProject, callback){	   
	    	projectModel.findById(pid)
				.populate('owner','_id name icon')
				.exec(function(err, result){
					if(err) callback(errorDef.databaseError);
					if(result == null) callback(errorDef.projectNotFindError);
					else callback(null,result);		
				});
	    }	
	   
	], callback);
	
};




exports.updateProjectInfo = function(selfuid, pid, toProject, cb){

	async.waterfall([
	    
	    function(callback){

			F.findProject(pid, callback);        
	    },

	    function(targetProject, callback){	   
	    	
	    	F.checkAdmin(selfuid,targetProject,callback);
	    },	

	    function(targetProject, callback){	   

			projectModel.findOneAndUpdate({'_id':pid},{ $set: toProject},function(err){
				if(err) callback(err);
				else callback(null);
			});
	    }	
	   
	], cb);
	

};



exports.finishProject = function(selfuid, pid, cb){

	async.waterfall([
	    
	    function(callback){

			F.findProject(pid, callback);     
	    },

	    function(targetProject, callback){	   
	    	
	    	F.checkAdmin(selfuid,targetProject,callback);
	    },	

	    function(targetProject, callback){	   

			projectModel.findOneAndUpdate({'_id':pid},{ $set: {realEndTime:new Date, done:true} }, function(err){
				if(err) callback(err);
				else callback(null);
			});
	    }	
	   
	], cb);
	

};


exports.addMemberById = function(selfuid, pid, uid, cb){

	async.waterfall([

	    function(callback){

	    	F.findProject(pid, callback);        
	    },
	    
	    function(targetProject, callback){

			F.checkAdmin(selfuid,targetProject,callback);
	    },

	    function(targetProject, callback){

	    	F.findUser(uid, targetProject, callback);
	    },

	    function(targetProject, newMember, callback){	    		    		    	

	    	if(targetProject.owner._id.equals(newMember._id)){
	    		return callback(errorDef.alreadyOwnerError);	    		
	    	}
	    	
	    	var member = targetProject.members.id(uid);
	    	if(member != null ) return callback(errorDef.alreadyMemberError);
	    		    	   
	    	callback(null, newMember, targetProject);
	    },

	    function(targetProject, newMember, callback){
	    	targetProject.members.push({
	    		_id: newMember._id,
	    		name: newMember.name,
	    		icon: newMember.icon,
	    		isAdmin: false
	    	});
	    	newMember.projects.push(targetProject._id);

	    	targetProject.save(function(err){
	    		if(err)return callback(err);	    		
	    	});
	    	newMember.save(function(err){
	    		if(err)return callback(err);
	    	})
	    	callback(null);
	    }

	], cb);

};



exports.removeMemberById = function(selfuid,pid, uid, cb){

	async.waterfall([

		function(callback){

	    	F.findProject(pid, callback);        
	    },
	    
	    function(targetProject, callback){

			F.checkAdmin(selfuid,targetProject,callback);
	    },

	    function(callback){

	    	F.findUser(uid, targetProject, callback);
	    },	    	    

	    function(targetProject, toDelMember, callback){	    		    		    	

	    	if(targetProject.owner._id.equals(toDelMember._id)){
	    		return callback(errorDef.cannotRemoveOwnerError);	    		
	    	}

	    	var member = targetProject.members.id(uid);
	    	if(member == null ) return callback(errorDef.memberNotFindError);	    	
	    		    		    	
	    	callback(null, targetProject, toDelMember);
	    },

	    function(targetProject, toDelMember, callback){
	    		    	
	    	targetProject.members.remove(uid);	    	

	    	toDelMember.projects.remove(pid);	    	
	    	
	    	targetProject.save(function(err){
	    		if(err) return callback(err);	    		
	    	});
	    	toDelMember.save(function(err){
	    		if(err) return callback(err);
	    	})
	    	callback(null);
	    }

	], cb);

};



exports.setAdmin = function(selfuid, pid, uid, bSet, cb){

	async.waterfall([
	    
	    function(callback){

			F.findProject(pid, callback);      
	    },

	    function(targetProject, callback){	   
	    	
	    	F.checkAdmin(selfuid,targetProject,callback);
	    },	

	    function(targetProject, callback){	   

	    	var member = targetProject.members.id(uid);
	    	if(member == null) return callback(errorDef.memberNotFindError);

	    	member.isAdmin = bSet;

	    	targetProject.save(function(err){
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