
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

exports.finishProject = function(selfuid, pid, callback){

	DataService.getProjectById(pid, function(err, project){
		if(err)return callback(err);
		/////////////////////////////////////
		//   project history
		/////////////////////////////////////
		project.history.push({
			type: HistoryService.PROJECT_TYPE.finish,
			who : selfuid,	
			what: [project.name]		
		});
		project.done = true;
		project.save(function(err,result){
			if(err)callback(ErrorService.makeDbErr(err));
			else callback(null);
		})
		for(var i=0;i<project.members.length;i++){
			MessageService.sendUserMessage(selfuid, project.members[i]._id, 
				MessageService.TYPE.project_close, '关闭了项目:'+project.name, function(){});
		}
	})
}

exports.restartProject = function(selfuid, pid, callback){

	DataService.getProjectById(pid, function(err, project){
		if(err)return callback(err);
		/////////////////////////////////////
		//   project history
		/////////////////////////////////////
		project.history.push({
			type: HistoryService.PROJECT_TYPE.restart,
			who : selfuid,
			what:[project.name]	
		});
		project.done = false;
		project.save(function(err,result){
			if(err)callback(ErrorService.makeDbErr(err));
			else callback(null);
		})
		for(var i=0;i<project.members.length;i++){
			MessageService.sendUserMessage(selfuid, project.members[i]._id, 
				MessageService.TYPE.project_restart, '重新启动了项目:'+project.name, function(){});
		}
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
							user.alerts.push({
								from: selfuid,
								type: MessageService.TYPE.project_delete,
								message: '删除了项目'+project.name
							})
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
			MessageService.sendUserMessage(selfuid, project.owner, 
				MessageService.TYPE.member_leave, '离开了项目'+project.name, function(){});
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
	    	MessageService.sendUserMessage(selfuid, toDelMember._id,
				MessageService.TYPE.member_remove, '把您移出项目'+targetProject.name, function(){});
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
	    	MessageService.sendUserMessage(selfuid, member._id, 
				MessageService.TYPE.member_admin, bSet?'把你设为<'+targetProject.name+'>的管理员':'把你设为<'+targetProject.name+'>的普通成员', function(){});
	    }	
	   
	], cb);

};

exports.setMemberToGroup = function(selfuid, pid, uid, group, callback){
	var noGroup = group =='' || group == null || group == undefined;
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
				MessageService.sendUserMessage(selfuid, uid, 
						MessageService.TYPE.member_group, noGroup?'把你设为没有小组':'把你分到小组 '+group, function(){});
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
		MessageService.sendUserMessage(selfuid, invite.from, 
			MessageService.TYPE.accept_invite, '接受了您的项目邀请',function(){});
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
		MessageService.sendUserMessage(selfuid, invite.from, 
			MessageService.TYPE.reject_invite, '拒绝了您的项目邀请',function(){});
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
			MessageService.sendUserMessage(user._id, invite.from, 
				MessageService.TYPE.accept_invite, '接受了您的项目邀请',function(){});
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
			MessageService.sendUserMessage(user._id, invite.from, 
				MessageService.TYPE.accept_invite, '拒绝了您的项目邀请',function(){});
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
				MessageService.sendUserMessage(user._id, invite.from, 
					MessageService.TYPE.accept_invite, '接受了您的项目邀请',function(){});					
			})
		}
	],callback);
}