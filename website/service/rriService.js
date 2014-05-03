
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');



exports.createOne = function(selfuid, pid, type, info, cb){

	return (function(selfuid, pid, info, cb){
		async.waterfall([

		    function(callback){

				F.findProject(pid, callback);       
		    },

		    function(targetProject, callback){	   

		    	F.checkAdmin(selfuid, targetProject,callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	targetProject[type].push(info);

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);	

	})(selfuid, pid, info, cb);
	
};

exports.setAll = function(selfuid, pid, type, info, cb){

	return (function(selfuid, pid, info, cb){
		async.waterfall([

		    function(callback){

				F.findProject(pid, callback);       
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	targetProject[type] = info;
		    	
		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);

	})(selfuid, pid, info, cb);

};


exports.deleteAll = function(selfuid, pid, type, cb){

	return (function(selfuid, pid, cb){

		async.waterfall([

		    function(callback){
				
				F.findProject(pid, callback);           
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	targetProject[type] = [];

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);
	
	})(selfuid, pid, cb)
	
};

exports.getAll = function(selfuid, pid, type, cb){

	return (function(selfuid, pid, cb){
		async.waterfall([

		    function(callback){
				
				F.findProject(pid, callback);    	        
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkMember(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	callback(null, targetProject[type]);
		    }	

		], cb);
	
	})(selfuid, pid, cb);
	
};

exports.modifyOne = function(selfuid, pid, rid, type, info, cb){

	return (function(selfuid, pid, rid, info, cb){

		async.waterfall([

		    function(callback){

				F.findProject(pid, callback);    	           
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	var r = targetProject[type].id(rid);
		    	if(r == null) return callback(errorDef.notFindError);

		    	r.description = info.description;
		    	r.level = info.level;

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});	    	
		    }	

		], cb);

	})(selfuid, pid, rid, info, cb);
	
};

exports.deleteOne = function(selfuid, pid, rid, type, cb){

	return (function(selfuid, pid, rid, cb){
		
		async.waterfall([

		    function(callback){
				
				F.findProject(pid, callback);    	          
		    },

		    function(targetProject, callback){	   
		    	
		    	F.checkAdmin(selfuid, targetProject, callback);
		    },	

		    function(targetProject, callback){	   
		    	
		    	var r = targetProject[type].id(rid);
		    	if(r == null) return callback(errorDef.notFindError);

		    	r.remove();
		    	
		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});	    	
		    }	

		], cb);
			
	})(selfuid, pid, rid, cb);
	
};