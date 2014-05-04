/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: sprint.js
//
// Abstract: deal with api sprint
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

var success = require('../service/errorDefine').success;

var F = require('./functions');

var sprintService = require('../service/sprintService');


////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
// get    /API/p/:pid/s             //get all sprint brief description as a list
// get    /API/p/:pid/s/:sid        //get a detail sprint information
// post   /API/p/:pid/s             //new a sprint of a project
// delete /API/p/:pid/s/:sid        //delete a sprint of a project
// put    /API/p/:pid/s/:sid        //modify basic info of a sprint of a project
// get    /API/p/:pid/s/:sid/start  //start a sprint of a project
// get    /API/p/:pid/s/:sid/finish //finish a sprint of a project
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	/*********************************************************
	 *
	 * for project sprint
	 *
	 */
	////////////////////get all sprint brief description as a list
	app.get('/API/p/:pid/s',F.checkUser);	
	app.get('/API/p/:pid/s',function(req,res){
		console.log('request get: /API/p/:pid/s, pid = '+ req.params.pid);
		
		sprintService.getSprintListOfProject(req.session.user._id, req.params.pid, function(err, sprints){
			if(err) res.json(err);
			else res.json(F.successWithValue('sprints', sprints));
		})
	});

	////////////////////get a detail sprint information
	app.get('/API/p/:pid/s/:sid',F.checkUser);	
	app.get('/API/p/:pid/s/:sid',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.getSprintById(req.session.user._id, req.params.pid, req.params.sid, 
			function(err, sprint){
			if(err) res.json(err);
			else res.json(F.successWithValue('sprint', sprint));
		})

	});

	////////////////////new a sprint of a project
	app.post('/API/p/:pid/s',F.checkUser);	
	app.post('/API/p/:pid/s',function(req,res){
		console.log('request post: /API/p/:pid/s, pid = '+ req.params.pid);

		var sprintInfo = {
			name: req.body.name,
			description: req.body.description,
		};
		if(req.body.endTime) sprintInfo.endTime = req.body.endTime;
		sprintService.createSprint(req.session.user._id, req.params.pid, sprintInfo,function(err){
			if(err) res.json(err);
			else res.json(success);
		});		

	});

	////////////////////delete a sprint of a project
	app.delete('/API/p/:pid/s/:sid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);

		sprintService.deleteSprint(req.session.user._id, req.params.pid, req.params.sid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});		
	
	});

	////////////////////modify basic info of a sprint of a project
	app.put('/API/p/:pid/s/:sid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.modifySprintById(req.session.user._id, req.params.pid, req.params.sid, {
			name: req.body.name,
			description: req.body.description
		}, function(err){
			if(err) res.json(err);
			else res.json(success);
		});		

	});

	////////////////////start a sprint of a project
	app.get('/API/p/:pid/s/:sid/start',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/start',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/start, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.setSprintState(req.session.user._id, req.params.pid, req.params.sid, 1, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////finish a sprint of a project
	app.get('/API/p/:pid/s/:sid/finish',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/finish',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/finish, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		sprintService.setSprintState(req.session.user._id, req.params.pid, req.params.sid, 2, function(err){
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