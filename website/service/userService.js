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
// exports.register = function(userInfo, callback)
// exports.findUserByEmail = function(email, callback)
// exports.loginByEmail = function(email, password, callback)
// exports.findUserById = function(id, callback)
// exports.updateUserInfo = function(id, toUser, callback)
// exports.getUserPorjects = function(id, callback)
// exports.getUserAllTask = function(selfuid, callback)
// exports.getUserCurrentTask = function(selfuid, callback)
//
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var userModel = require('../schemas/userSchema');

var taskModel = require('../schemas/taskSchema');

var projectModel = require('../schemas/projectSchema');

var _  = require('underscore');

var async = require('async');

var errorDef = require('./errorDefine');


////////////////////////////////////////////////////////////////////////////////////////
//
//             functions
//
////////////////////////////////////////////////////////////////////////////////////////
exports.register = function(userInfo, callback){		

	async.waterfall([
		function(callback){
			var user = new userModel(userInfo);
			user.save(function(err, result){
				if(err) return callback(err);	
				callback(null);	
			});		
			
		},

		function(callback){			
			exports.findUserByEmail(userInfo.email, function(err, result){
				if(err) callback(err);
				else callback(null, result);
			});
		}
	],callback);		
};

exports.findUserByEmail = function(email, callback){

	userModel.findOne({ 'email' : email }, function(err, result){
		if(err) return callback(errorDef.databaseError);
		if(result == null) callback(errorDef.userNotFindError);
		else{
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

};

exports.loginByEmail = function(email, password, callback){

	userModel.findOne({ 'email' : email }, function(err, result){		
		if(err) 
			callback(errorDef.databaseError);
		else if(result == null) 
			callback(errorDef.userNotFindError);
		else if( ! _.isEqual(password, result.password))
			callback(errorDef.passwordNotRightError);
		else{			
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

}

exports.findUserById = function(id, callback){

	userModel.findById(id, function(err, result){
		if(err) return callback(errorDef.databaseError);
		if(result == null) callback(errorDef.userNotFindError);
		else{
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

};

exports.updateUserInfo = function(id, toUser, callback){

	userModel.findOneAndUpdate({'_id':id},{ $set: toUser},callback);

};

exports.getUserPorjects = function(id, callback){

	async.waterfall([

		function(callback){
			userModel.findById(id)			     
			         .exec(function(err, result){
						if(err) callback(err);
						if(result == null) callback(errorDef.userNotFindError);
						else{
							callback(null, result);
						}				
				});
		},
		function(user, callback){
			var projects = [];
			var queries = [];
			var makeQuery = function(project){
				return function(callback){
					projectModel.findById(project)
								  .populate('cSprint', 'taskTotal taskFinish')						  								 
								  .select('_id name description cSprint createTime owner done')
								  .exec(function(err, p){						  	
								  	if(err)
								  		return callback(err);						  	
							  		if(p)
							  		{							  			
							  			projects.push(p);
						  			}
						  			callback();							  		
								  });					
				}
			}; 
			
			user.projects.forEach( function(c){
				queries.push(makeQuery(c));
			});
			
			async.parallel(queries,function(err){
				
				if(err) return callback(err);
								
				else{					
					callback(null, projects);
				}
			});		
		}		
	],callback);
};

exports.getUserAllTask = function(selfuid, callback){

	taskModel.find({executer: selfuid})
	         .exec(function(err, result){
	         	if(err) callback(err);
	         	else callback(null, result);
	         });

};

exports.getUserCurrentTask = function(selfuid, callback){

	taskModel.find({executer: selfuid})
			 .where('done').equals(false)
	         .exec(function(err, result){
	         	if(err) callback(err);
	         	else callback(null, result);
	         });	         
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