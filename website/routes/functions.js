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