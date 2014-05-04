/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Copyright(c)2014,SSE,Tongji university Easyagile team
// Allrightsreserved.
//
// Filename: functions.js
//
// Abstract: some useful function for all routers
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
// checkLogin = function(req, res, next)   //if user not login, redirect to login page 
// checkNotLogin = function(req,res,next)  //if user login, redirect to index 
// checkUser = function (req,res,next)     //if user not login, stop routes and return error message
// successWithValue = function(key, value) //clone a new success object and append key-value element
// 
// important : 
//
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////
//
//               helper functions
//
////////////////////////////////////////////////////////////////////////////////////////
var _ = require('underscore');

var success = require('../service/errorDefine').success;

var notLoginError = require('../service/errorDefine').notLoginError;

exports.checkLogin = function(req, res, next){

    if(!req.session.user){
	      return res.redirect('/login');
    }
    next();
}

exports.checkNotLogin = function(req,res,next){

    if(req.session.user){
	      return res.redirect('/');
    }
    next();
}

exports.checkUser = function (req,res,next){

    if(!req.session.user)
       return res.json(notLoginError);
    else
	   next();
}


exports.successWithValue = function(key, value){

    var s = _.clone(success);
    s[key] = value;
    return s;
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