/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: index.js
//
// Abstract: gather all router, and routes app
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
// function(app){} //route express app instance
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
//            require modules
//
////////////////////////////////////////////////////////////////////////////////////////


var F = require('./functions');

var staticRouter    = require('./staticRouter')
	, userRouter    = require('./userRouter')
	, projectRouter = require('./projectRouter')
	, rriRouter     = require('./rriRouter')
	, sprintRouter  = require('./sprintRouter')
	, backlogRouter = require('./backlogRouter')
	, taskRouter    = require('./taskRouter')
	, topicRouter   = require('./topicRouter');


var error   = require('../service/errorDefine').urlError;

var success = require('../service/errorDefine').success;

////////////////////////////////////////////////////////////////////////////////////////
//
//               router
//
////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app) {

	app.use(function(req,res,next){
		console.log('request URL: '+req.url);
		next();
	});


	/*********************************************************
	 *
	 *  get static html file
	 *
	 *  /, /reg, /login, /logout, /user/:uid, /project/:pid
	 *	 
	 */


	staticRouter(app);






	/*********************************************************
	 *
	 * browser interact with server	 	
	 *
	 */
	/*********************************************************
	 *
	 * user APIs	
	 *
	 */
	/*********************************************************
	 *
	 * for user message
	 *
	 */
	 userRouter(app);






	/*********************************************************
	 *
	 * project basic APIs	
	 *
	 */	
	projectRouter(app);




	
	/*********************************************************
	 *
	 * project requirements and releases basic APIs	
	 *
	 */
	rriRouter(app);


	

	/*********************************************************
	 *
	 * for project topics
	 *
	 */
	topicRouter(app);




	/*********************************************************
	 *
	 * for project sprint
	 *
	 */
	sprintRouter(app);





	/*********************************************************
	 *
	 * for project sprint backlog
	 *
	 */
	/*********************************************************
	*
	* for project sprint defects
	*
	*/
	/*********************************************************
	 *
	 * for project sprint issues
	 *
	 */
	backlogRouter(app);




	/*********************************************************
	 *
	 * for project sprint tasks
	 *
	 */
	taskRouter(app);





	/*********************************************************
	 *
	 * for unsupported URLs
	 *
	 */
	app.use(function(req,res) {
		//res.render("404");
		console.log('unsupported URL:'+req.url);
		res.json(error);
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