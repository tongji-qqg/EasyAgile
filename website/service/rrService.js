
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');

var databaseError = {
		message: 'database error!'
	},
	projectNotFindError = {
		message: 'peoject not find!'
	},
	userNotFindError = {
		message: 'user not find!'
	},
	memberNotFindError = {
		message: 'member not find!'
	},
	requirementNotFindError = {
		message: 'requirement not find!'
	},
	alreadyOwnerError = {
		message: 'you are already project owner!'
	},
	alreadyMemberError = {
		message: 'alreay team member!'
	},
	cannotRemoveOwnerError = {
		message: 'project owner can not remove'
	},
	notAdminError = {
		message: 'no do not have admin permission '
	};

var getIndexBy = function (array, name, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][name].equals(value)) {
            return i;
        }
    }
    return -1;
}

function findProject(pid, callback){
	projectModel.findById(pid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(projectNotFindError);
				else callback(null,result);				
			});
}

function checkAdmin(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner._id.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null && member.isAdmin)
		permissin = true;
	
	if( !permission )return callback(notAdminError);	    	
	callback(null, targetProject);
}

function checkMember(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner._id.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null)
		permissin = true;
	
	if( !permission )return callback(notAdminError);	    	
	callback(null, targetProject);
}

exports.addaRequirement = function(selfuid, pid, req, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){	   
	    	
	    	targetProject.requirements.push(req);

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	

	], cb);

};

exports.setRequirements = function(selfuid, pid, reqs, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   
	    	
	    	checkAdmin(selfuid, targetProject, callback);
	    },	

	    function(targetProject, callback){	   
	    	
	    	targetProject.requirements = reqs;
	    	
	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	

	], cb);

};


exports.deleteAllRequirements = function(selfuid, pid, cb){

	async.waterfall([

	    function(callback){
			
			findProject(pid, callback);           
	    },

	    function(targetProject, callback){	   
	    	
	    	checkAdmin(selfuid, targetProject, callback);
	    },	

	    function(targetProject, callback){	   
	    	
	    	targetProject.requirements = [];

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	

	], cb);

};

exports.getAllRequirements = function(selfuid, pid, cb){

	async.waterfall([

	    function(callback){
			
			findProject(pid, callback);    	        
	    },

	    function(targetProject, callback){	   
	    	
	    	checkMember(selfuid, targetProject, callback);
	    },	

	    function(targetProject, callback){	   
	    	
	    	callback(null, targetProject.requirements);
	    }	

	], cb);

};

exports.modifyRequirementById = function(selfuid, pid, rid, req, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);    	           
	    },

	    function(targetProject, callback){	   
	    	
	    	checkAdmin(selfuid, targetProject, callback);
	    },	

	    function(targetProject, callback){	   
	    	
	    	var r = targetProject.requirements.id(rid);
	    	if(r == null) return callback(requirementNotFindError);

	    	r.description = req.description;
	    	r.level = req.level;

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});	    	
	    }	

	], cb);
};

exports.deleteRequirementById = function(selfuid, pid, rid, cb){

	async.waterfall([

	    function(callback){
			
			findProject(pid, callback);    	          
	    },

	    function(targetProject, callback){	   
	    	
	    	checkAdmin(selfuid, targetProject, callback);
	    },	

	    function(targetProject, callback){	   
	    	
	    	var r = targetProject.requirements.id(rid);
	    	if(r == null) return callback(requirementNotFindError);

	    	r.remove();
	    	
	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});	    	
	    }	

	], cb);
};