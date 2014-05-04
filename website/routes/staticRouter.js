/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: staticRouter.js
//
// Abstract: deal with get page requests
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

/*********************************************************
 *
 *  get static html file
 *  /, /reg, /login, /logout, /user/:uid, /project/:pid
 *
 */
//////////////index html

var F = require('./functions');

var projectService = require('../service/projectService');


////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
// /
// /reg
// /login
// /logout
// /user/:uid
// /project/:pid
// /project_sprint/:pid
// /project_taskboard/:pid/sprint/:sid
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app) {
	//////////////index html
	app.get('/', function (req,res) {
		console.log("request get: /");
		res.render('index', {
			title:'主页',
			user:req.session.user
		});
	});

	//////////////register html
	app.get('/reg', F.checkNotLogin);
	app.get('/reg', function(req,res){
		console.log('request get: /reg');		
		res.render('signup',{
			title:'注册',
			user:req.session.user
		});
	});

	//////////////login html
	app.get('/login', F.checkNotLogin);
	app.get('/login', function(req,res){
		console.log('request get: /login');
		res.render('login',{
			title: '登录',
			user: req.session.user
		});
	});

	//////////////logout	
    app.get('/logout',F.checkLogin);
	app.get('/logout', function (req,res) {
		console.log('request get: /logout');
		req.session.user = null;
		res.redirect('/');
	});

	//////////////user html
    app.get('/user/:uid', F.checkLogin);    
	app.get('/user/:uid', function (req,res) {
		console.log('request get: /user/:uid, uid = '+ req.params.uid);
		res.render('user_project',{
			title:'用户中心',
			user:req.session.user
		});
	});

	//////////////project html
    app.get('/project/:pid', F.checkLogin);    
	app.get('/project/:pid', function (req,res) {
		console.log('request get: /project/:pid, pid = '+ req.params.pid);
		
		res.render('project_main',{								
					user:req.session.user,								
				});	

	});

	//////////////project_sprint html
    app.get('/project_sprint/:pid', F.checkLogin);    
	app.get('/project_sprint/:pid', function (req,res) {
		console.log('request get: /project_sprint/:pid, pid = '+ req.params.pid);
		
		res.render('project_sprint',{								
					user:req.session.user,								
				});	

	});

	//////////////project_taskboard html/sprint/:sid
    app.get('/project_taskboard/:pid/sprint/:sid', F.checkLogin);    
	app.get('/project_taskboard/:pid/sprint/:sid', function (req,res) {
		console.log('request get: /project_taskboard/:pid/sprint/:sid, pid = '+ req.params.pid + 'sid = '+ req.params.sid);
		
		res.render('project_taskboard',{								
					user:req.session.user,								
				});	

	});
}

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