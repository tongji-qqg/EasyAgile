
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var sprintService = require('./sprintService');
var async = require('async');
var crypto = require('crypto');
var validator = require('validator');

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
	    	
	    	targetProject.save(function(err){
	    		if(err)return callback(ErrorService.makeDbErr(err));	    		
	    	});
	    	newMember.save(function(err){
	    		if(err)return callback(ErrorService.makeDbErr(err));
	    	})
	    	callback(null,newMember);
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

exports.inviteMemberById = function(selfuid, pid, uid, callback){

	async.waterfall([
		function(callback){
			DataService.getProjectById(pid,function(err,project){
				if(err) return callback(err);
				project.invite.push({
					from: selfuid,
					userId: uid
				});
				/////////////////////////////////////
				//   project history
				/////////////////////////////////////
				project.history.push({
					type: HistoryService.PROJECT_TYPE.member_invite_id,
					who: selfuid,
					toUser: uid
				});
				project.save(function(err){
					if(err) callback(ErrorService.makeDbErr(err));
					else callback(null,project);
				})
			})
		},
		function(project, callback){
			DataService.getUserById(uid, function(err, user){
				if(err) return callback(ErrorService.makeDbErr(err));
				user.alerts.push({
					type: 0,
					from: selfuid,
					message: '邀请您加入项目: ' + project.name,
					data:['/API/p/'+pid+'/inviteById/accept', '/API/p/'+pid+'/inviteById/reject']
				})
				user.save(function(err){
					if(err)callback(ErrorService.makeDbErr(err));
					else callback(null);
				});
			});
		}
	],callback)
}

exports.acceptInviteById = function(selfuid, pid, callback){
	DataService.getProjectById(pid, function(err, project){
		if(err) return callback(err);
		var invite;
		for(var i=0;i<project.invite.length;i++){
			if(project.invite[i].userId == selfuid){
				invite = project.invite[i];
				break;
			}
		}
		if(!invite) return callback(ErrorService.inviteLinkInvalide);
		project.invite.remove(invite._id);
		/////////////////////////////////////
		//   project history
		/////////////////////////////////////
		project.history.push({
			type: HistoryService.PROJECT_TYPE.member_accept,
			who : selfuid,			
		});
		project.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			else exports.addMemberById(selfuid, pid, selfuid, callback);
		})
		
	})
}

exports.rejectInviteById = function(selfuid, pid, callback){
	DataService.getProjectById(pid, function(err, project){
		if(err) return callback(err);
		var invite;
		for(var i=0;i<project.invite.length;i++){
			if(project.invite[i].userId == selfuid){
				invite = project.invite[i];
				break;
			}
		}
		if(!invite) return callback(ErrorService.inviteLinkInvalide);
		project.invite.remove(invite._id);
		project.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			else callback(null);
		})
		
	})
}

exports.inviteMemberByEmail = function(selfuid, selfname, pid, email, callback){
	var localAppURL = 'http://' + process.env.host + ':' + process.env.port;
	if(! validator.isEmail(email)) 
		return callback(ErrorService.emailFormatError);
	async.waterfall([
		function(callback){
			DataService.getProjectById(pid, callback);
		},
		function(project,callback){
			crypto.randomBytes(48, function(ex, buf) {
  				var token = buf.toString('hex');
  				callback(null, project, token);
			});
		},
		function(project, token, callback){			

			DataService.getUserByEmail(email.toLowerCase(), function(err, user){
				if(err) return callback(err);
				
				if(user){
					if(user._id == selfuid) return callback(ErrorService.userNotFindError);
					var link = localAppURL + '/API/p/'+pid+'/inviteByEmail/'+email+'/token/'+token+'/';
					
					EmailService.send(email, '项目邀请', selfname + ' 邀请你参加项目 '+ project.name +
						             '<br/>点击<a href="'+link+'accept"">链接</a>来加入项目'+
						             '<br/>点击<a href="'+link+'reject"">链接</a>来拒绝邀请',function(){});				
				}else{
					var link = localAppURL + '/API/reg/p/'+pid+'/inviteByEmail/'+email+'/token/'+token;
					
					EmailService.send(email, '项目邀请', selfname + ' 邀请你参加项目 '+ project.name +
						             '<br/>点击<a href="'+link+'">链接</a>来注册一个帐号，并加入项目',function(){});									
				}
				project.invite.push({
					from: selfuid,
					email: email,
					token: token
				})
				/////////////////////////////////////
				//   project history
				/////////////////////////////////////
				project.history.push({
					type: HistoryService.PROJECT_TYPE.member_invite_e,
					who: selfuid,
					what:[email]
				});
				project.save(function(err){
					if(err) callback(err);
					else callback(null);
				})
			});// end dataService
		}
	],callback);	
}

exports.acceptInviteByEmail = function(pid, email, token, callback){
	DataService.getProjectById(pid, function(err, project){
		if(err) return callback(err);
		var invite;
		for(var i=0;i<project.invite.length;i++){
			if(project.invite[i].email == email && project.invite[i].token == token){
				invite = project.invite[i];
				break;
			}
		}
		if(!invite) return callback(ErrorService.inviteLinkInvalide);
		DataService.getUserByEmail(email.toLowerCase(),function(err,user){
			if(err) return callback(err);
			if(!user) return callback(ErrorService.userNotFindError);
			project.invite.remove(invite._id);
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({
				type: HistoryService.PROJECT_TYPE.member_accept,
				who : user._id,			
			});
			project.save(function(err){
				if(err) callback(ErrorService.makeDbErr(err));
				else exports.addMemberById(user._id, pid, user._id, callback);
			});
		})				
	})
}

exports.rejectInviteByEmail = function(pid, email, token, callback){
	DataService.getProjectById(pid, function(err, project){
		if(err) return callback(err);
		var invite;
		for(var i=0;i<project.invite.length;i++){
			if(project.invite[i].email == email && project.invite[i].token == token){
				invite = project.invite[i];
				break;
			}
		}
		if(!invite) return callback(ErrorService.inviteLinkInvalide);
		project.invite.remove(invite._id);
		project.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));			
		})
		DataService.getUserByEmail(email.toLowerCase(),function(err,user){
			if(err)callback(err);
			else callback(null, user);
		});
	})
}

exports.validateRegAcceptEmail = function(pid, email, token, callback){
	DataService.getProjectById(pid,function(err, project){
		if(err)return callback(ErrorService.makeDbErr(err));
		var invite;
		for(var i=0;i<project.invite.length;i++){
			if(project.invite[i].email == email && project.invite[i].token == token){
				invite = project.invite[i];
				break;
			}
		}
		if(!invite) return callback(ErrorService.inviteLinkInvalide);
		return callback(null);
	})
}
exports.regAcceptInviteByEmail = function(pid, email, userInfo, token, callback){
	// console.log(pid);
	// console.log(email);
	// console.log(userInfo);
	// console.log(token);
	async.waterfall([
		function(callback){
			var md5 = crypto.createHash('md5');
    		userInfo.password = md5.update(userInfo.password).digest('base64');
    		userInfo.email = email.toLowerCase();
			var user = new userModel(userInfo);
			user.save(function(err,result){
				if(err) return callback(ErrorService.makeDbErr(err));	
				callback(null, result);
			})
		},
		function(user,callback){
			DataService.getProjectById(pid, function(err, project){
				if(err) return callback(err);
				var invite;
				for(var i=0;i<project.invite.length;i++){
					if(project.invite[i].email == email && project.invite[i].token == token){
						invite = project.invite[i];
						break;
					}
				}
				if(!invite) return callback(ErrorService.inviteLinkInvalide);
								
				project.invite.remove(invite._id);
				/////////////////////////////////////
				//   project history
				/////////////////////////////////////
				project.history.push({
					type: HistoryService.PROJECT_TYPE.member_accept,
					who : user._id,			
				});
				project.save(function(err){
					if(err) callback(ErrorService.makeDbErr(err));
					else exports.addMemberById(user._id, pid, user._id, callback);
				});
								
			})
		}
	],callback);
}