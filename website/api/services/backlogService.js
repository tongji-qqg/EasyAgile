var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');


var async = require('async');

////////////////////////////////////////////////////////////////////////////////////////
//
//            createor function
//
////////////////////////////////////////////////////////////////////////////////////////

//type in [backlogs, defects, issues]
exports.createOne = function(selfuid, pid, sid, type, info, callback){

	return (function(selfuid, pid, sid, info, callback){

		async.waterfall([

		    function(callback) {

		    	DataService.getSprintById(sid,callback)
		    	
		    },
		    function(sprint, callback){

		    	sprint[type].push(info);
	       		sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null);
	       		});
		    }	

		], callback);

	})(selfuid, pid, sid, info, callback);
}

exports.modifyOne = function(selfuid, pid, sid, rid, type, info, callback){

	return (function(selfuid, pid, sid, rid, info, callback){

		async.waterfall([

		    function(callback){

				DataService.getSprintById(sid,callback)       
		    },

		    function(sprint, callback){

		    	var target = sprint[type].id(rid);
		    	if(target == null) return callback(errorDef.notFindError);

		    	target.description = info.description;
		    	target.level = info.level;
		    	target.title = info.title;
		    	target.estimate = info.estimate;

	       		sprint.save(function(err){
	       			if(err) return callback(err);
	       			else callback(null);
	       		});
		    }	

		], callback);

	})(selfuid, pid, sid, rid, info, callback);
}

exports.getAll = function(selfuid, pid, sid, type, callback){

	return (function(selfuid, pid, sid, callback){

		async.waterfall([

		    function(callback){

				DataService.getSprintById(sid,callback)  
		    },

		    function(sprint, callback){		    	

		    	callback(null, sprint[type]);
		    }	

		], callback);

	})(selfuid, pid, sid, callback);
}
exports.setAll = function(selfuid, pid, sid, type, info, callback){

	return (function(selfuid, pid, sid, info, callback){

		async.waterfall([

		    function(callback){

				DataService.getSprintById(sid,callback)      
		    },

		    function(sprint, callback){		    	

		    	sprint[type] = info;
	    	
		    	sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		    }	

		], callback);

	})(selfuid, pid, sid, info, callback);
}

exports.deleteOne = function(selfuid, pid, sid, rid, type, callback){

	return (function(selfuid, pid, sid, rid, callback){

		async.waterfall([

		    function(callback){

				DataService.getSprintById(sid,callback)      
		    },

		    function(sprint, callback){		   

		    	var target = sprint[type].id(rid);
		    	if(target == null) return callback(errorDef.notFindError); 	
				
				target.remove();
				sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
	    		});	    			    	
		    }	

		], callback);

	})(selfuid, pid, sid, rid, callback);
}

exports.deleteAll = function(selfuid, pid, sid, type, callback){

	return (function(selfuid, pid, sid, callback){

		async.waterfall([

		    function(callback){

				DataService.getSprintById(sid,callback)  
		    },

		    function(sprint, callback){		    	

		    	sprint[type] = [];
		    	sprint.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
	    		});	

		    }	

		], callback);

	})(selfuid, pid, sid, callback);
}