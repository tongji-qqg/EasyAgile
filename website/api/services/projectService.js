
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var sprintService = require('./sprintService');
var async = require('async');



exports.createProject = function(selfuid, name, des, cb){
	
	async.waterfall([

		function(callback){

			DataService.getUserById(selfuid,callback);	
		},

		function(user, callback){			
			var project = new projectModel({
				name: name,
				description: des,
				owner: selfuid		
			});
			project.save(function(err){
				if(err) callback(ErrorService.makeDbErr(err));
				else callback(null, user, project);
			});		
		},

		function(user, project, callback){			
			user.projects.push(project._id);
			user.save(function(err){
				if(err) callback(ErrorService.makeDbErr(err));//not deal project!
				else callback(null, user, project);
			});
		},

		function(user, project, callback){
			sprintService.createSprint(selfuid, project._id, {
				name: 'sprint 1',
				description: 'first sprint'
			}, function(err, result){
				if(err) callback(ErrorService.makeDbErr(err));
				else{ 
					project.cSprint = result._id;
					project.save(function(err){
						if(err) callback(ErrorService.makeDbErr(err));
						else callback(null, project);
					})					
				}
			});
		}

	],cb);	
};



exports.findProjectInfoById = function(pid, callback) {
		  
    DataService.getProjectInfoById(pid, callback);

};




exports.updateProjectInfo = function(pid, toProject, callback){

	projectModel.findOneAndUpdate({'_id':pid},{ $set: toProject},function(err){
		if(err) callback(ErrorService.makeDbErr(err));
		else callback(null);
	});	    	   
};


exports.addMemberById = function(selfuid, pid, uid, cb){

	async.waterfall([

	    function(callback){

	    	DataService.getProjectInfoById(pid,callback);       
	    },	   	   

	    function(targetProject, callback){

	    	DataService.getUserWithProject(uid, targetProject, callback);
	    },

	    function(targetProject, newMember, callback){	    		    		    	

	    	if(targetProject.owner._id.equals(newMember._id)){
	    		return callback(ErrorService.alreadyOwnerError);	    		
	    	}
	    	
	    	var member = targetProject.members.id(uid);
	    	if(member != null ) return callback(ErrorService.alreadyMemberError);
	    		    	   
	    	callback(null, targetProject, newMember);
	    },

	    function(targetProject, newMember, callback){
	    	targetProject.members.push({
	    		_id: newMember._id,
	    		name: newMember.name,
	    		icon: newMember.icon,
	    		isAdmin: false
	    	});
	    	newMember.projects.push(targetProject._id);

	    	targetProject.save(function(err){
	    		if(err)return callback(ErrorService.makeDbErr(err));	    		
	    	});
	    	newMember.save(function(err){
	    		if(err)return callback(ErrorService.makeDbErr(err));
	    	})
	    	callback(null);
	    }

	], cb);

};



exports.removeMemberById = function(selfuid,pid, uid, cb){

	async.waterfall([

		function(callback){

	    	DataService.getProjectInfoById(pid,callback);        
	    },	    	 

	    function(targetProject, callback){

	    	DataService.getUserWithProject(uid, targetProject, callback);
	    },	    	    

	    function(targetProject, toDelMember, callback){	    		    		    	

	    	if(targetProject.owner._id.equals(toDelMember._id)){
	    		return callback(ErrorService.cannotRemoveOwnerError);	    		
	    	}

	    	var member = targetProject.members.id(uid);
	    	if(member == null ) return callback(ErrorService.memberNotFindError);	    	
	    		    		    	
	    	callback(null, targetProject, toDelMember);
	    },

	    function(targetProject, toDelMember, callback){
	    		    	
	    	targetProject.members.remove(uid);

	    	toDelMember.projects.remove(pid);	    	
	    	
	    	targetProject.save(function(err){
	    		if(err) return callback(ErrorService.makeDbErr(err));	    		
	    	});
	    	toDelMember.save(function(err){
	    		if(err) return callback(ErrorService.makeDbErr(err));
	    	})
	    	callback(null);
	    }

	], cb);

};



exports.setAdmin = function(pid, uid, bSet, cb){

	async.waterfall([
	    
	    function(callback){

			DataService.getProjectById(pid,callback);   
	    },	    

	    function(targetProject, callback){	   

	    	var member = targetProject.members.id(uid);
	    	if(member == null) return callback(ErrorService.memberNotFindError);

	    	member.isAdmin = bSet;

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	
	   
	], cb);

};