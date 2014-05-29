
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
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({						
				type: HistoryService.PROJECT_TYPE.create,
				who : selfuid,
				what: [project.name,project.description]							
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
				description: 'first sprint',				
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




exports.updateProjectInfo = function(selfuid, pid, toProject, callback){
	
	DataService.getProjectById(pid, function(err, project){
		if(err)return callback(err);
		/////////////////////////////////////
		//   project history
		/////////////////////////////////////
		var what = [];
		if(toProject.name){
			project.name = toProject.name;
			what.push(toProject.name);
		}
		if(toProject.description){
			project.description = toProject.description;
			what.push(toProject.description);
		}
		project.history.push({
			type: HistoryService.PROJECT_TYPE.info,
			who : selfuid,
			what: what
		});
		project.save(function(err,result){
			if(err)callback(ErrorService.makeDbErr(err));
			else callback(null);
		})
	})
	// projectModel.findOneAndUpdate({'_id':pid},{ $set: toProject},function(err){
	// 	if(err) callback(ErrorService.makeDbErr(err));
	// 	else callback(null);
	// });	    	   
};

exports.finishProject = function(selfuid, pid, cb){

	DataService.getProjectById(pid, function(err, project){
		if(err)return callback(err);
		/////////////////////////////////////
		//   project history
		/////////////////////////////////////
		project.history.push({
			type: HistoryService.PROJECT_TYPE.finish,
			who : selfuid,			
		});
		project.done = true;
		project.save(function(err,result){
			if(err)callback(ErrorService.makeDbErr(err));
			else callback(null);
		})
	})
}

exports.deleteProject = function(selfuid, pid, callback){
	
	DataService.getProjectById(pid, function(err, project){
		if(err)return callback(err);
		if(project.owner != selfuid)
			return exports.exitProject(selfuid, pid, callback);
		async.waterfall([
			function(callback){
				/////////////////////////////////////
				//   project history
				/////////////////////////////////////
				project.history.push({
					type: HistoryService.PROJECT_TYPE.del,
					who : selfuid,
				});
				project.deleted = true;

				DataService.getUserById(selfuid, function(err, user){
					if(err) return callback(ErrorService.makeDbErr(err));
					user.projects.remove(pid);
					user.save(function(err){
						if(err) callback(ErrorService.makeDbErr(err));
						callback(null, project);
					})//end user save
				})			
			},
			
			function(project,callback){
				var query = [];
				function makeDeleteQuery(mid){
					return function(callb){
						DataService.getUserById(mid,function(err,user){
							if(err)callb(err);
							user.projects.remove(project._id);
							user.save(function(err){
								if(err) callb(err);
								callb(null);
							});
						});
					}
				}
				if(!project.members) return callback(null, project);
				project.members.forEach(function(m){
					query.push(makeDeleteQuery(m._id));
				});
				async.parallel(query,function(err){
					if(err)callback(err);
					else callback(null, project);
				});
			},
			function(project,callback){
				project.save(function(err,result){
					if(err)callback(ErrorService.makeDbErr(err));
					else callback(null);
				});
		}],callback);
	});
}


exports.exitProject = function(selfuid, pid, cb){
	
	async.waterfall([
		
		function(callback){
			DataService.getProjectById(pid, function(err, project){
				if(err)return callback(err);
				var member = project.members.id(selfuid);
				if(!member) return callback(ErrorService.userNotFindError);
				member.remove();
				/////////////////////////////////////
				//   project history
				/////////////////////////////////////
				project.history.push({
					type: HistoryService.PROJECT_TYPE.member_leave,
					who : selfuid,
				});
				
				callback(null,project);				
			})
		},
		function(project, callback){
			//save user first
			DataService.getUserById(selfuid, function(err, user){
				if(err) callback(err);
				user.projects.remove(pid);
				user.save(function(err){
					if(err) callback(ErrorService.makeDbErr(err));
					else callback(null, project);
				});
			});	
		},
		function(project, callback){
			project.save(function(err,result){
				if(err)callback(ErrorService.makeDbErr(err));
				else callback(null);
			});
		}

	],cb)	
}


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
	    	/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			targetProject.history.push({
				type: HistoryService.PROJECT_TYPE.member_invite,
				who : selfuid,
				toUser: newMember._id
			});
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
	    	/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			targetProject.history.push({
				type: HistoryService.PROJECT_TYPE.member_remove,
				who : selfuid,
				toUser: toDelMember._id
			});
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



exports.setAdmin = function(selfuid, pid, uid, bSet, cb){

	async.waterfall([
	    
	    function(callback){

			DataService.getProjectById(pid,callback);   
	    },	    

	    function(targetProject, callback){	   

	    	var member = targetProject.members.id(uid);
	    	if(member == null) return callback(ErrorService.memberNotFindError);

	    	member.isAdmin = bSet;
	    	/////////////////////////////////////
			//   project history
			/////////////////////////////////////
	    	targetProject.history.push({
	    		type: bSet? HistoryService.PROJECT_TYPE.member_admin : HistoryService.PROJECT_TYPE.member_normal,
	    		who : selfuid,
	    		toUser: member._id
	    	});
	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	
	   
	], cb);

};

exports.setMemberToGroup = function(selfuid, pid, uid, group, callback){

	async.waterfall([
		function(callback){

		    	DataService.getProjectById(pid,callback);        
		},

		function(targetProject, callback){	   
				var toUser;
				if(uid == targetProject.owner){
					toUser = targetProject.owner;
					targetProject.ownerGroup = group;
				} else{
			    	var member = targetProject.members.id(uid);
			    	if(member == null) return callback(ErrorService.memberNotFindError);
			    	toUser = member._id;
			    	member.group = group;
				}
				/////////////////////////////////////
				//   project history
				/////////////////////////////////////
		    	targetProject.history.push({
		    		type: HistoryService.PROJECT_TYPE.member_group,
		    		who : selfuid,
		    		toUser: toUser,
		    		what: group==null ? []: [group]
		    	});
		    	targetProject.save(function(err){
		    		if(err) callback(err);
		    		else callback(null);
		    	});
		}
	],callback);		 	 

}

exports.addGroup = function(selfuid, pid, group, callback){

	async.waterfall([
		function(callback){

		    	DataService.getProjectById(pid,callback);        
		},

		function(project, callback){
			group = group.trim();	   
			if(group == null || _.contains(project.groups,group))
				return callback(null);
			project.groups.push(group);
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
	    	project.history.push({
	    		type: HistoryService.PROJECT_TYPE.group_new,
	    		who : selfuid,	    		
	    		what: [group]
	    	});
	    	project.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
		}
	],callback);		 	 

}

exports.deleteGroup = function(selfuid, pid, group, callback){

	async.waterfall([
		function(callback){

		    	DataService.getProjectById(pid,callback);        
		},

		function(project, callback){	   
			group = group.trim();
			if(group == null || ! _.contains(project.groups, group))
				return callback(null);
			project.groups = _.without(project.groups,  group);
			if(project.ownerGroup == group) project.ownerGroup = undefined;
			project.members.forEach(function(m){
				if(m.group == group)
					m.group = undefined;
			})
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
	    	project.history.push({
	    		type: HistoryService.PROJECT_TYPE.group_delete,
	    		who : selfuid,
	    		what: [group]
	    	});
	    	project.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
		}
	],callback);		 	 

}

exports.getProjectMemberGroup = function(pid, callback){

	 DataService.getProjectInfoById(pid, function(err, project){
	 	if(err) return callback(err);
	 	return callback(null, {
	 		owner: project.owner,
	 		ownerGroup: project.ownerGroup,
	 		members: project.members,
	 		groups: project.groups
	 	});
	 });
}