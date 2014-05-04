/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: backlogRouter.js
//
// Abstract: deal with api requests about backlogs
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
// 
// 
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////
//
//            data define
//
////////////////////////////////////////////////////////////////////////////////////////

var TYPE = {
	b : 'backlogs',	
};

var F = require('./functions');

var backlogService = require('../service/backlogService');

var success = require('../service/errorDefine').success;

////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
// get     /API/p/:pid/s/:sid/backlog   //get backlog of a sprint
// post    /API/p/:pid/s/:sid/backlog   //add a piece of backlog for a sprint
// put     /API/p/:pid/s/:sid/b/:bid    //modify a piece of backlog for a sprint
// put     /API/p/:pid/s/:sid/b         //backlog bulk update
// delete  /API/p/:pid/s/:sid/b/:bid    //delete a piece of backlog for a sprint
// delete  /API/p/:pid/s/:sid/b         //delete all backlog for a sprint
//
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	/*********************************************************
	 *
	 * for project sprint backlog
	 *
	 */
	////////////////////get backlog of a sprint
	app.get('/API/p/:pid/s/:sid/backlog',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		backlogService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err, backlog){
				
				if(err) res.json(err);
				else res.json(F.successWithValue('backlog', backlog));
		});

	});

	////////////////////add a piece of backlog for a sprint
	app.post('/API/p/:pid/s/:sid/backlog',F.checkUser);	
	app.post('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		backlogService.createOne(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify a piece of backlog for a sprint
	app.put('/API/p/:pid/s/:sid/b/:bid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		
		backlogService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////backlog bulk update
	app.put('/API/p/:pid/s/:sid/b',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/b',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/b, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		backlogService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, req.body.backlog,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a piece of backlog for a sprint
	app.delete('/API/p/:pid/s/:sid/b/:bid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		
		backlogService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete all backlog for a sprint
	app.delete('/API/p/:pid/s/:sid/b',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/b',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/b, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		backlogService.deleteAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
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