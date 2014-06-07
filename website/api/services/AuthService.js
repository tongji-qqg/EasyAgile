/**
 * /api/services/AuthService.js
 *
 * Generic auth service, which is used to check if user has access to asked object or which role
 * he / she is attached to that object.
 *
 * Basically all service methods uses finally either 'hasProjectAccess' or 'hasProjectAdmin' methods
 * to determine actual access to asked object.
 */
"use strict";

var async = require("async");
var randomstring = require("randomstring");
var month = 30 * 24 * 60 * 60 * 1000;
// Remember me tokens, that are valid for single server instance
var tokens = {}; //uid -- token
var REMEMBER_TIME = month;


exports.tryToForget = function(uid){    
    if(uid){
        uid = uid.toString;        
        delete tokens[uid];         
    }        
}

exports.tryToRemember = function(req, res, uid){
    uid = uid.toString();    

    var token = randomstring.generate(64);
    tokens[uid] = token;    

    res.cookie('remember_me', token, { maxAge: REMEMBER_TIME, httpOnly: true });
    res.cookie('uid',   uid, { maxAge: REMEMBER_TIME, httpOnly: true });
}

exports.tryToRecall = function(req, res, callback){
    var cToken  = req.cookies.remember_me;
    var cUid    = req.cookies.uid;
    
    if(tokens[cUid] && tokens[cUid] === cToken){               
        exports.tryToRemember(req, res, cUid);
        DataService.getUserById(cUid, callback);       
    }
    else callback('not find');
}

/**
 * Service method to issue new remember me token for specified user.
 *
 * @param   {sails.model.user}  user    User object
 * @param   {Function}          next    Callback function
 */
exports.hasProjectAdmin = function(uid, pid, next) {
    async.waterfall([
        function(callback){
            DataService.getProjectById(pid,function(err, project){
                if(err) callback(err);
                else callback(null,project);
            })
        },
        function(project, callback){
            var permission = false;

            if(project.owner.equals(uid))
                permission = true;          

            var member = project.members.id(uid);         
            if(member != null && member.isAdmin)
                permission = true;
            
            if( !permission )return callback(ErrorService.notAdminError);           
            callback(null);
        }
    ],next);
};

/**
 * Service method to issue new remember me token for specified user.
 *
 * @param   {sails.model.user}  user    User object
 * @param   {Function}          next    Callback function
 */
exports.hasProjectAccess = function(uid, pid, next) {
    sails.log.verbose('uid '+ uid + ' pid '+ pid);
    async.waterfall([
        function(callback){
            DataService.getProjectById(pid,function(err, project){
                if(err) callback(err);
                else callback(null,project);
            })
        },
        function(project, callback){            
            var permission = false;

            if(project.owner.equals(uid))
                permission = true;

            var member = project.members.id(uid);         
            if(member != null)
                permission = true;
            
            if( !permission )return callback(ErrorService.notMemberError);           
            callback(null);
        }
    ],next);
};

/**
 * Service method to issue new remember me token for specified user.
 *
 * @param   {sails.model.user}  user    User object
 * @param   {Function}          next    Callback function
 */
exports.hasProjectOwner = function(uid, pid, next) {
    async.waterfall([
        function(callback){
            DataService.getProjectById(pid,function(err, project){
                if(err) callback(err);
                else callback(null,project);
            })
        },
        function(project, callback){
            var permission = false;

            if(project.owner.equals(uid))
                permission = true;                      
            
            if( !permission )return callback(ErrorService.notOwnerError);           
            callback(null);
        }
    ],next);
};