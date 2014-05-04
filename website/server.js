/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: server.js
//
// Abstract: web server entrance, create express + mongodb server 
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
// Mainfunctions：no
// 	
// important : 
// http.createServer(app).listen(18080);
// mongoose.connect('mongodb://localhost/easyagile');	
// routes(app);
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



/****************************************************************
 * Module dependencies
 *
 ****************************************************************/ 

var express  = require('express');
var routes   = require('./routes');
var http     = require('http');
var path     = require('path');
//var MongoStore = require('connect-mongo')(express)
var settings = require('./settings')
var ejs      = require('ejs');
var port     = 18080;
var mongoose = require('mongoose');



/****************************************************************
 * all exvironments
 *
 ****************************************************************/ 

mongoose.connect('mongodb://localhost/easyagile');

var app = express();


// 
app.set('port',port);
app.set('views',path.join(__dirname,'/views'));

app.engine('.html',ejs.__express);
app.set('view engine','html');

app.use(express.favicon(__dirname+'/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,
//  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//  store: new MongoStore({
//    db: settings.db
//  })
}));

app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));

if ( 'development' == app.get('env')){
	//app.use(express.errorHandler);
}


/****************************************************************
 * start server and route app
 *
 ****************************************************************/ 

http.createServer(app).listen(app.get('port'),function(){
	console.log('Express server listening on port '+app.get('port'));
});

routes(app);


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