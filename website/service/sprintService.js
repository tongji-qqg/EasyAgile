var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');


var async = require('async');

var F = require('./schemaHelpFuncs');
var errorDef = require('./errorDefine');




exports.createSprint = function (selfuid, pid, sprintInfo, cb){
	
	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var sprint = new sprintModel(sprintInfo);
	    	sprint.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, targetProject, sprint);
	    	});
	    },

	    function(targetProject, newSprint, callback){	   
	    	
	    	targetProject.sprints.push(newSprint._id);

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, newSprint);
	    	});
	    }	

	], cb);

};

exports.deleteSprint = function(selfuid, pid, sid, cb){

		async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = targetProject.sprints.indexOf(sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);

	    	sprintModel.findById(sid, function(err, sprint){
	    		if(err) return callback(err);	    	
	    		if(!sprint) return callback(errorDef.sprintNotFindError);
	    		sprint.deleted = true;
	    		sprint.save(function(err){
	    			if(err) callback(err);
	    		})
	    	});	    		    			
	    	callback(null)
	    }
	   
	], cb);
};

exports.getSprintListOfProject = function(selfuid, pid, cb){

	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {
	
			
			projectModel.findOne({'_id':pid})
					    .populate('sprints', '_id name description createTime')					    
					    .exec(function(err, project){
					    	if(err) callback(err);
					    	else callback(null, project.sprints);					    	
					    })			 				
		    			     	
	    }

	], cb);

};

exports.getSprintById = function(selfuid, pid, sid, cb){
	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {
					
			
			sprintModel.findOne({'_id':sid})										    
					    .exec(function(err, sprint){
					    	if(err) callback(err);
					    	else callback(null, sprint);
					    })			 				
		    			     	
	    }

	], cb);
}


exports.modifySprintById = function(selfuid, pid, sid, sprintInfo, cb){
	async.waterfall([

	    function(callback){

			F.findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = F.getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);
	
			sprintModel.findOneAndUpdate({'_id':sid},{ $set: sprintInfo},function(err){
				if(err) callback(err);
				else callback(null);
			});	 				
		    			     	
	    }

	], cb);
};

exports.setSprintState = function (selfuid, pid, sid, state, cb){
	async.waterfall([

	    function(callback){

			F.indProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	F.checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = F.getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);
	
			sprintModel.findOneAndUpdate({'_id':sid},{ $set: {state: state}},function(err){
				if(err) callback(err);
				else callback(null);
			});	 				
		    			     	
	    }

	], cb);	
};