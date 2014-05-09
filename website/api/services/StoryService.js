
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');


exports.createOne = function(pid, type, info, cb){

	return (function(pid, info, cb){
		async.waterfall([

		    function(callback){

				DataService.getProjectById(pid, callback);       
		    },

		    function(targetProject, callback){	   
		    	
		    	targetProject[type].push(info);

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);	

	})(pid, info, cb);
	
};

exports.setAll = function(pid, type, info, cb){

	return (function(pid, info, cb){
		async.waterfall([

		    function(callback){

				DataService.getProjectById(pid, callback);     
		    },

		    function(targetProject, callback){	   
		    	
		    	targetProject[type] = info;
		    	
		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);

	})(pid, info, cb);

};


exports.deleteAll = function(pid, type, cb){

	return (function(pid, cb){

		async.waterfall([

		    function(callback){
				
				DataService.getProjectById(pid, callback);       
		    },

		    function(targetProject, callback){	   
		    	
		    	targetProject[type] = [];

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], cb);
	
	})(pid, cb)
	
};

exports.getAll = function(pid, type, cb){
	if(type == 'issues') {
		return (function(pid, cb){
			projectModel.findById(pid)
			            .exec(function(err,project){
			            	if(project == null) return cb(ErrorService.projectNotFindError);
			            	userModel.populate(project.issues, {path:'finder', select:'_id name icon'}, function(err){
			            		if(err) cb(ErrorService.makeDbErr(err));
			            		else cb(null, project.issues);
			            	});
			            });

		
		})(pid, cb);
	} else {
		return (function(pid, cb){
			async.waterfall([

			    function(callback){
					
					DataService.getProjectById(pid, callback);    	        
			    },

			    function(targetProject, callback){	   		    			    

			    	callback(null, targetProject[type]);
			    }	

			], cb);
		
		})(pid, cb);
	}
	
};

exports.modifyOne = function(pid, rid, type, info, cb){

	return (function(pid, rid, info, cb){

		async.waterfall([

		    function(callback){

				DataService.getProjectById(pid, callback);
		    },

		    function(targetProject, callback){	   
		    	
		    	var r = targetProject[type].id(rid);
		    	if(r == null) return callback(ErrorService.notFindError);

		    	r.description = info.description;
		    	r.level = info.level;

		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});	    	
		    }	

		], cb);

	})(pid, rid, info, cb);
	
};

exports.deleteOne = function(pid, rid, type, cb){

	return (function(pid, rid, cb){
		
		async.waterfall([

		    function(callback){
				
				DataService.getProjectById(pid, callback);
		    },

		    function(targetProject, callback){	   
		    	
		    	var r = targetProject[type].id(rid);
		    	if(r == null) return callback(ErrorService.notFindError);

		    	r.remove();
		    	
		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});	    	
		    }	

		], cb);
			
	})(pid, rid, cb);
	
};