/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: taskRouter.js
//
// Abstract: deal with task routes
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

var taskService = require('../service/taskService');

var success = require('../service/errorDefine').success;


////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
// get     /API/p/:pid/s/:sid/tasks            //get tasks of a sprint
// post    /API/p/:pid/s/:sid/tasks            //add a task for a sprint
// put     /API/p/:pid/s/:sid/t/:tid           //modify a task for a sprint
// put     /API/p/:pid/s/:sid/t/:tid/progress  //set task progress
// delete  /API/p/:pid/s/:sid/t/:tid           //delete a task for a sprint
// put     /API/p/:pid/s/:sid/t/:tid/u/:uid    //assign a task to a member
// delete  /API/p/:pid/s/:sid/t/:tid/u/:uid    //remove a task from a member 
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	/*********************************************************
	 *
	 * for project sprint tasks
	 *
	 */
	////////////////////get tasks of a sprint
	app.get('/API/p/:pid/s/:sid/tasks',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		taskService.getTasks(req.session.user._id, req.params.pid, req.params.sid, function(err, tasks){
			if(err) res.json(err);
			else res.json(F.successWithValue('tasks', tasks));
		});

	});

	////////////////////add a task for a sprint
	app.post('/API/p/:pid/s/:sid/tasks',F.checkUser);	
	app.post('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		taskService.createTask(req.session.user._id, req.params.pid, req.params.sid, {
			title      : req.body.title,
			description: req.body.description,
			deadline   : req.body.deadline,
			level      : req.body.level
		}, function(err, task){
			if(err) res.json(err);
			else res.json(F.successWithValue('task', task));
		});
	});

	////////////////////modify a task for a sprint
	app.put('/API/p/:pid/s/:sid/t/:tid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/t/:tid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		
		taskService.modifyTaskById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, {
			description: req.body.description,
			deadline   : req.body.deadline,
			level      : req.body.level
		}, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
	});

	////////////////////set task progress
	app.put('/API/p/:pid/s/:sid/t/:tid/progress',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/t/:tid/progress',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid/progress, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		
		taskService.setTaskProgressById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, 
			req.body.progress, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
	});

	////////////////////delete a task for a sprint
	app.delete('/API/p/:pid/s/:sid/t/:tid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/t/:tid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/t/:tid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		
		taskService.deleteTaskById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, 
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////assign a task to a member
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid/u/:uid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid + ' uid '+req.params.uid);
		
		taskService.assignMemberToTask(req.session.user._id, req.params.pid, req.params.sid, req.params.tid,
			req.params.uid, function(err){
				if(err) res.json(err);
				else res.json(success);
			});
	});

	////////////////////remove a task from a member
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/t/:tid/u/:uid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid + ' uid '+req.params.uid);
		
		taskService.removeMemberFromTask(req.session.user._id, req.params.pid, req.params.sid, req.params.tid,
			req.params.uid, function(err){
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