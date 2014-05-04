/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: userRouter.js
//
// Abstract: deal with user routes
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

var userService = require('../service/userService');


////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
// post  /reg   //register
// post  /login //login
// get   /API/u/name/:name   //get user name like :name, return a list(array) of user info, may be null array([])
// get   /API/u/email/:email //get a email corresponding user info, may be null({})
// get   /API/u/:uid         //get one user info by id
// post  /API/u              //for android validate user
// put   /API/u/:uid         //change user information: name, icon, phone, birthady
// put   /API/u/pw/:uid      //change user password
// get   /API/u/:uid/tasks/all      //get user tasks
// get   /API/u/:uid/tasks/current  //get user tasks
// get   /API/u/:uid/projects       //get user projects
// get   /API/u/:uid/m              //get all unread user messages
// put   /API/u/:uid/m/:mid         //set a message to read
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

	/*********************************************************
	 *
	 * browser interact with server	 	
	 *
	 */
	//////////////register
	app.post('/reg', function(req,res){
		console.log('request post: /reg');
		var newUser = {
			name  : req.body.name,
			email : req.body.email,
			password: req.body.password
		};
		userService.register(newUser, function(err, user){
				if(err){
					console.log('register err '+ err.message);					
					res.json(err);					
				}
				else{
					console.log('register successs! '+ user._id);
					req.session.user = user; //用户信息存入session
					req.session.save();

					var r = {
						state : 'success',
						errorNumber : 0,
						user  : user
					};
		   			res.header('Access-Control-Allow-Credentials', 'true');		   			
		   			res.json(r);
				}
			});		   
	});

	//////////////login
	app.post('/login', F.checkNotLogin);
	app.post('/login', function(req, res){
		 console.log('request post: /login');

		 userService.loginByEmail(req.body.emailaddress, req.body.password,function(err,result){
		 	if(err){
		 		console.log(err);
		 		res.redirect('/login');
		 	}
		 	else{
		 		console.log(result);
		 		req.session.user = result;
		 		res.redirect('/user/'+result._id);
		 	}
		 });
		 
	});

	/*********************************************************
	 *
	 * user APIs	
	 *
	 */
	/////////////////////get user name like :name, return a list(array) of user info, may be null array([])
	app.get('/API/u/name/:name',function(req,res){
		console.log('request get: API/u/nameLike/:name, name = '+ req.params.name);
		res.json(userList);
	});

	//////////////////////get a email corresponding user info, may be null({})
	app.get('/API/u/email/:email',function(req,res){
		console.log('request get: API/u/nameLike/:email, email = '+ req.params.email);

		userService.findUserByEmail(req.params.email, function(err, result){
			if(err)
				res.json(err);
			else
				res.json(F.successWithValue('user', result));
		});

	});

	/////////////////////get one user info by id
	app.get('/API/u/:uid', F.checkUser);
	app.get('/API/u/:uid', function(req,res){
		console.log('request get: /API/u/:uid, uid = '+ req.params.uid);

		userService.findUserById(req.params.uid, function(err,result){
			if(err) res.json(err);
			else res.json(F.successWithValue('user', result));
		});

	});

	/////////////////////for android validate user
	app.post('/API/u',function(req,res){
		console.log('request post: /API/u');

		userService.loginByEmail(req.body.emailaddress, req.body.password,function(err,result){
			if(err) res.json(err);
			else{
				req.session.user = result;
				
				res.json(F.successWithValue('user', result));
			}
		});
		
	});

	/////////////////////change user information: name, icon, phone, birthady
	app.put('/API/u/:uid',F.checkUser);
	app.put('/API/u/:uid',function(req,res){
		console.log('request put: /API/u/:uid, uid = '+ req.params.uid);

		var targetUser = {					
		};
		if(req.body.name)targetUser.name = req.body.name;
		if(req.body.icon)targetUser.icon = req.body.icon;
		if(req.body.phone)targetUser.phone = req.body.phone;
		if(req.body.birthday)targetUser.birthday = req.body.birthday;

		if(targetUser === {}) return res.json(success);
		userService.updateUserInfo(req.session.user._id, targetUser, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	/////////////////////change user password
	app.put('/API/u/pw/:uid',F.checkUser);
	app.put('/API/u/pw/:uid',function(req,res){
		console.log('request put: /API/u/pw/:uid, uid = '+ req.params.uid);

		if(req.body.password == null)
			return res.json(err);
		userService.updateUserInfo(req.session.user._id, { password: req.body.password }, function(err){
			if(err) res.json(err);
			else res.json(success);
		});				

	});

	/////////////////////get user tasks
	app.get('/API/u/:uid/tasks/all',F.checkUser);
	app.get('/API/u/:uid/tasks/all',function(req,res){
		console.log('request get: /API/u/:uid/tasks/all, uid = '+ req.params.uid);
		
		userService.getUserAllTask(req.session.user._id, function(err, result){
			if(err) res.json(err);
			else res.json(F.successWithValue('tasks', result));
		})

	});


	/////////////////////get user tasks
	app.get('/API/u/:uid/tasks/current',F.checkUser);
	app.get('/API/u/:uid/tasks/current',function(req,res){
		console.log('request get: /API/u/:uid/tasks/current, uid = '+ req.params.uid);
		
		userService.getUserCurrentTask(req.session.user._id, function(err, result){
			if(err) res.json(err);
			else res.json(F.successWithValue('tasks', result));
		});

	});


	/////////////////////get user projects
	app.get('/API/u/:uid/projects',F.checkUser);
	app.get('/API/u/:uid/projects',function(req,res){
		console.log('request get: /API/u/:uid/projects, uid = '+ req.params.uid);
		
		userService.getUserPorjects(req.session.user._id, function(err, projects){
			if(err) res.json(err);
			else{ 				
				res.json(F.successWithValue('projects', projects));
			}
		});

	});

	/*********************************************************
	 *
	 * for user message
	 *
	 */
	////////////////////get all unread user messages
	app.get('/API/u/:uid/m',F.checkUser);
	app.get('/API/u/:uid/m',function(req,res){
		console.log('request get: /API/u/:uid/m, uid = '+ req.params.uid);
		res.json(messageList);
	});

	////////////////////set a message to read
	app.put('/API/u/:uid/m/:mid',F.checkUser);
	app.put('/API/u/:uid/m/:mid',function(req,res){
		console.log('request put: /API/u/:uid/m/:mid, uid = '+ req.params.uid + ' mid = '+ req.params.mid);
		res.json(success);
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