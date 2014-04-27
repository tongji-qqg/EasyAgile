var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

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
	topicNotFindError = {
		message: 'topic not find!'
	},
	sprintNotFindError = {
		message: 'sprint not find!'
	},
	commentNotFindError = {
		message: 'comment not find!'
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

Array.prototype.removeByPos = function(from, to) {
	console.log('here');
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var getArrayIndexByObjectId = function (array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].equals(id)) {
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




exports.createSprint = function (selfuid, pid, sprintInfo, cb){
	
	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
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
	    		else callback(null);
	    	});
	    }	

	], cb);

};

exports.deleteSprint = function(selfuid, pid, sid, cb){

		async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = targetProject.sprints.indexOf(sid);
	    	if(pos == -1) return callback(sprintNotFindError);

	    	sprintModel.findById(sid, function(err, sprint){
	    		if(err) return callback(err);	    	
	    		if(!sprint) return callback(sprintNotFindError);
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

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
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

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
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

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(sprintNotFindError);
	
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

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(sprintNotFindError);
	
			sprintModel.findOneAndUpdate({'_id':sid},{ $set: {state: state}},function(err){
				if(err) callback(err);
				else callback(null);
			});	 				
		    			     	
	    }

	], cb);	
};