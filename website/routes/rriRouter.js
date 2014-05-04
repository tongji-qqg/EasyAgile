/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: rriRouter.js
//
// Abstract: deal with api requests about release, requirement, issue
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

var rrService = require('../service/rriService');

var success = require('../service/errorDefine').success;



////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
// get     /API/p/:pid/r   //get require list of a project
// delete  /API/p/:pid/r   //delete all requirements of a project
// post    /API/p/:pid/r   //add a requirement of a project
// put     /API/p/:pid/r   //bulk update
// put     /API/p/:pid/r/:rid  //modify a requirement of a project
// delete  /API/p/:pid/r/:rid  //delete a requirement of a project
//
// get     /API/p/:pid/s/:sid/issues  //get issues of a project
// post    /API/p/:pid/s/:sid/issues  //add a issue for a project
// put     /API/p/:pid/s/:sid/i/:iid  //modify a issue for a project
// put     /API/p/:pid/s/:sid/i       //modify all issue for a project
// delete  /API/p/:pid/s/:sid/i/:iid  //delete a issue for a project
// delete  /API/p/:pid/s/:sid/i       //delete all issue for a project
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){


	/*********************************************************
	 *
	 * project requirements basic APIs	
	 *
	 */
	////////////////////get require list of a project
	app.get('/API/p/:pid/r',F.checkUser);
	app.get('/API/p/:pid/r',function(req,res){
		console.log('request get: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.getAllRequirements(req.session.user._id, req.params.pid, function(err,result){
			if(err) res.json(err);
			else res.json(F.successWithValue('requirements', result));
		});

	});

	////////////////////delete all requirements of a project
	app.delete('/API/p/:pid/r',F.checkUser);
	app.delete('/API/p/:pid/r',function(req,res){
		console.log('request delete: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.deleteAllRequirements(req.session.user._id, req.params.pid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////add a requirement of a project
	app.post('/API/p/:pid/r',F.checkUser);
	app.post('/API/p/:pid/r',function(req,res){
		console.log('request post: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.addaRequirement(req.session.user._id, req.params.pid, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////bulk update
	app.put('/API/p/:pid/r',F.checkUser);
	app.put('/API/p/:pid/r',function(req,res){
		console.log('request put: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.setRequirements(req.session.user._id, req.params.pid, req.body.requirements, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////modify a requirement of a project
	app.put('/API/p/:pid/r/:rid',F.checkUser);
	app.put('/API/p/:pid/r/:rid',function(req,res){
		console.log('request put: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);
		
		rrService.modifyRequirementById(req.session.user._id, req.params.pid, req.params.rid, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a requirement of a project
	app.delete('/API/p/:pid/r/:rid',F.checkUser);
	app.delete('/API/p/:pid/r/:rid',function(req,res){
		console.log('request delete: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);

		rrService.deleteRequirementById(req.session.user._id, req.params.pid, req.params.rid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});




	/*********************************************************
	 *
	 * for project issues
	 *
	 */
	////////////////////get issues of a project
	app.get('/API/p/:pid/s/:sid/issues',F.checkUser);	
	app.get('/API/p/:pid/s/:sid/issues',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/issues, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, 
			function(err, result){
				
				if(err) res.json(err);
				else res.json(F.successWithValue('issues', result));
		});

	});

	////////////////////add a issue for a project
	app.post('/API/p/:pid/s/:sid/issues',F.checkUser);	
	app.post('/API/p/:pid/s/:sid/issues',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/issues, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		
		bdiService.createOne(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify a issue for a project
	app.put('/API/p/:pid/s/:sid/i/:iid',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		
		bdiService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.iid, TYPE.i, {
			description: req.body.description,
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////modify all issue for a project
	app.put('/API/p/:pid/s/:sid/i',F.checkUser);	
	app.put('/API/p/:pid/s/:sid/i',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/i, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, req.body.issues,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a issue for a project
	app.delete('/API/p/:pid/s/:sid/i/:iid',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		
		bdiService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.iid, TYPE.i,
			function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a issue for a project
	app.delete('/API/p/:pid/s/:sid/i',F.checkUser);	
	app.delete('/API/p/:pid/s/:sid/i',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/i, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid);
		
		bdiService.deleteAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.i, 
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