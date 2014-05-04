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
// exports.postTopic = function(selfuid, pid, topic, cb)
// exports.getTopic = function(selfuid, pid, tid, bIsComments, cb)
// exports.deleteTopic = function(selfuid, pid, tid, cb)
// exports.getTopicListOfProject = function(selfuid, pid, cb)
// exports.commentTopic = function(selfuid, pid, tid, comment, cb)
// exports.deleteCommentOfTopic = function(selfuid, pid, tid, cid, cb)
// 
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var topicModel = require('../schemas/topicSchema');


var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');


////////////////////////////////////////////////////////////////////////////////////////
//
//             functions
//
////////////////////////////////////////////////////////////////////////////////////////
exports.postTopic = function(selfuid, pid, topic, cb){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var topic = new topicModel({
	    		author: selfuid,
	    		title: topic.title,
	    		body:  topic.body
	    	});
	    	topic.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, targetProject, topic);
	    	});
	    },

	    function(targetProject, newTopic, callback){	   
	    	
	    	targetProject.topics.push(newTopic._id);

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	

	], cb);

};

exports.getTopic = function(selfuid, pid, tid, bIsComments, cb){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = targetProject.topics.indexOf(tid);
	    	if(pos == -1) return callback(errorDef.topicNotFindError);

	    	topicModel.findOne({'_id': tid})
	    			 .populate('author','_id name icon')	    			 
	    			 .exec(function(err, topic){
	    			 	if(err) callback(err);
	    			 	else callback(null, topic); 
	    			 });	    	
	    },

	    function(topic, callback){	    	
			
			var commentList = [];
			var queries = [];
			var makeQuery = function(comment){
				return function(callback){
					userModel.findById(comment.owner)								  
								  .select('_id name icon')								  
								  .exec(function(err, user){						  	
								  	if(err)
								  		return callback(err);
								  	
							  		if(user)
							  		{							  			
							  			var c = {
							  				comment: comment,
							  				user: user
							  			};
						  				commentList.push(c);								  			
						  			}
						  			callback();							  		
								  });					
				}
			}; 
			
			topic.comments.forEach( function(c){
				queries.push(makeQuery(c));
			});
			
			async.parallel(queries,function(err){
				
				if(err) return callback(err);
				
				if(bIsComments)
					callback(null, commentList);
				else{					
					callback(null, topic);
				}
			});					
	    }	   

	], cb);

};

exports.deleteTopic = function(selfuid, pid, tid, cb){

		async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = targetProject.topics.indexOf(tid);
	    	if(pos == -1) return callback(errorDef.topicNotFindError);

	    	topicModel.findOne({'_id': tid},function(err,topic){
	    		if(err) return callback(errorDef.databaseError);
	    		if(!topic) return callback(errorDef.topicNotFindError);
	    		topic.deleted = true;
	    		topic.save(function(err){
	    			if(err) return callback(err);
	    		});
	    	});	    		    	
	
	    	callback(null);
	    }
	   
	], cb);
};

exports.getTopicListOfProject = function(selfuid, pid, cb){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {
			
			var topicList = [];
			var queries = [];
			var makeQuery = function(tid){
				return function(callback){
					topicModel.findOne({'_id': tid})
								  .populate('author','_id name icon')
								  .select('title author date deleted')
								  .where('deleted == false')
								  .exec(function(err, topic){						  	
								  	if(err)
								  		return callback(err);
								  	
							  		if(topic && topic.deleted == false)
						  				topicList.push(topic);							  		
						  			callback();							  		
								  });					
				}
			}; 
			
			targetProject.topics.forEach( function(id){
				queries.push(makeQuery(id));
			});
			
			async.parallel(queries,function(err){
				
				if(err) callback(err);
				else callback(null,topicList);
			});					 				
		    			     	
	    }

	], cb);

};

exports.commentTopic = function(selfuid, pid, tid, comment, cb){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){
	    	topicModel.findById(tid, function(err, topic){
	    		if(err) return callback(errorDef.topicNotFindError);
	    		callback(null,topic);
	    	});
	    },

	    function(topic, callback) {

	    	var c = {
	    		owner: selfuid,
	    		body: comment,	    		
	    	};
	    	topic.comments.push(c);

	    	topic.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }
	    

	], cb);

};

exports.deleteCommentOfTopic = function(selfuid, pid, tid, cid, cb){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){
	    	topicModel.findById(tid, function(err, topic){
	    		if(err) return callback(errorDef.topicNotFindError);
	    		callback(null,topic);
	    	});
	    },

	    function(topic, callback) {

	    	var comment = topic.comments.id(cid);

	    	if(comment == null) return callback(errorDef.commentNotFindError);
	    	comment.remove();

	    	console.log(topic);
	    	topic.save(function(err){
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