/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: topicRouter.js
//
// Abstract: deal with topic routes
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
// function(app){} //get the app, and routes it
// 	
// important : 
// 
// 
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
//
//            data define 
//
////////////////////////////////////////////////////////////////////////////////////////

var F = require('./functions');

var topicService = require('../service/topicService');

var success = require('../service/errorDefine').success;


////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
// get    /API/p/:pid/t              //get all topics brief description as a list
// get    /API/p/:pid/t/:tid         //get a detail topic information
// post   /API/p/:pid/t              //post a topic to project
// delete /API/p/:pid/t/:tid         //delete a detail topic information
// post   /API/p/:pid/tc/:tid        //comment a  topic
// get    /API/p/:pid/tc/:tid        //get comment list
// delete /API/p/:pid/t/:tid/c/:cid  //delete a comment
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	
	/*********************************************************
	 *
	 * for project topics
	 *
	 */
	////////////////////get all topics brief description as a list
	app.get('/API/p/:pid/t',F.checkUser);	
	app.get('/API/p/:pid/t',function(req,res){
		console.log('request get: /API/p/:pid/t, pid = '+ req.params.pid);

		topicService.getTopicListOfProject(req.session.user._id, req.params.pid,function(err, topics){
			if(err) res.json(err);
			else res.json(F.successWithValue('topics', topics));
		});
		
	});

	////////////////////get a detail topic information
	app.get('/API/p/:pid/t/:tid',F.checkUser);	
	app.get('/API/p/:pid/t/:tid',function(req,res){
		console.log('request get: /API/p/:pid/t/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);

		topicService.getTopic(req.session.user._id, req.params.pid, req.params.tid, false,function(err, topic){
			if(err) res.json(err);
			else res.json(F.successWithValue('topic', topic));
		});
		
	});

	////////////////////post a topic to project
	app.post('/API/p/:pid/t',F.checkUser);	
	app.post('/API/p/:pid/t',function(req,res){
		console.log('request post: /API/p/:pid/t, pid = '+ req.params.pid);

		topicService.postTopic(req.session.user._id, req.params.pid, {
			title: req.body.title,
			body: req.body.body
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////delete a detail topic information
	app.delete('/API/p/:pid/t/:tid',F.checkUser);	
	app.delete('/API/p/:pid/t/:tid',function(req,res){
		console.log('request delete: /API/p/:pid/t/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);

		topicService.deleteTopic(req.session.user._id, req.params.pid, req.params.tid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////comment a  topic
	app.post('/API/p/:pid/tc/:tid',F.checkUser);	
	app.post('/API/p/:pid/tc/:tid',function(req,res){
		console.log('request post: /API/p/:pid/tc/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);
		
		topicService.commentTopic(req.session.user._id, req.params.pid, req.params.tid, req.body.comment,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////get comment list
	app.get('/API/p/:pid/tc/:tid',F.checkUser);
	app.get('/API/p/:pid/tc/:tid',function(req,res){
		console.log('request get: /API/p/:pid/tc/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);
		
		topicService.getTopic(req.session.user._id, req.params.pid, req.params.tid, true,function(err, comments){
			if(err) res.json(err);
			else res.json(F.successWithValue('comments', comments));
		});
	});

	////////////////////delete a comment
	app.delete('/API/p/:pid/t/:tid/c/:cid',F.checkUser);
	app.delete('/API/p/:pid/t/:tid/c/:cid',function(req,res){
		console.log('request delete: /API/p/:pid/t/:tid/c/:cid, pid = '+ req.params.pid + 
			' tid = '+ req.params.tid + ' cid = '+ req.params.cid);
		
		topicService.deleteCommentOfTopic(req.session.user._id, req.params.pid, req.params.tid, req.params.cid,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});
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