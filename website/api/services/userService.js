
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel = require('../schemas/taskSchema');
var projectModel = require('../schemas/projectSchema');

var _  = require('underscore');
var validator = require('validator');
var async = require('async');
var crypto = require('crypto');
var errorDef = require('./errorDefine');

exports.register = function(userInfo, callback){		
	var endDay = new Date();
	endDay.setDate(endDay.getDate()+1);
	async.waterfall([
		function(callback){
			userInfo.email = userInfo.email.toLowerCase();

			if(! validator.isEmail(userInfo.email)) 
				return callback(ErrorService.emailFormatError);
			userInfo.tokenVaildUntil = endDay;
			var md5 = crypto.createHash('md5');
    		userInfo.password = md5.update(userInfo.password).digest('base64');
			var user = new userModel(userInfo);
    		callback(null, user);
		},
		function(user, callback){
			crypto.randomBytes(48, function(ex, buf) {
  				var token = buf.toString('hex');
  				callback(null, user, token);
			});
		},
		function(user, token, callback){
			user.emailToken = token;
			var localAppURL = 'http://' + process.env.host + ':' + process.env.port;
			var link = localAppURL + '/auth/e/'+user.email+'/t/'+token;
			sails.log.verbose('generate link:'+link);
			user.save(function(err, result){
				if(err) return callback(ErrorService.makeDbErr(err));	
				callback(null, user, link);	
			});	
			
		},
		function(user, link, callback){
			EmailService.send(user.email
				, '帐号激活'
				, 'please click this link <a href="'+link+'">'+link+'</a>to activate your account'
				, function(err, result){
					if(err) {
						sails.log.error('send activate email to '+user.email+' fail'+err);
						//callback(err);
					}						
				});		
			callback(null, user);		
		}
	],callback);		
};

exports.findUserByEmail = function(email, callback){

	DataService.getUserByEmail(email, function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));
		if(!result) return callback(ErrorService.userNotFindError);
		else{			
			callback(null,DataService.makeUserInfo(result));
		}
	});

};

exports.findUserLikeName = function(name, callback){

	var select = {};
	if(name) select = {name:new RegExp('\w*'+name+'\w*', "i")};
	userModel.find(select , function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));
		if(!result) return callback(ErrorService.userNotFindError);
		else{			
			var users = [];
			result.forEach(function(r){
				users.push(DataService.makeUserInfo(r));
			});
			users.slice(0,10);
			callback(null,users);
		}
	});

};

exports.loginByEmail = function(email, password, callback){
	if(!email || !password) return callback(ErrorService.missInfoError);
	var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('base64');

	DataService.getUserByEmail(email.toLowerCase(), function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));
		if(!result) return callback(ErrorService.userNotFindError);
		else if(result.emailToken) 
			callback(ErrorService.notValidateEmailError);
		else if( ! _.isEqual(password, result.password))
			callback(ErrorService.passwordNotRightError);
		else{						
			callback(null,DataService.makeUserInfo(result));
		}
	});
}

exports.activateEmail = function(email, token, callback){

	async.waterfall([
		function(callback){
			var now = new Date();
			DataService.getUserByEmail(email, function(err, result){
				if(err) return callback(ErrorService.makeDbErr(err));
				else if(!result)
					callback(ErrorService.userNotFindError);
				else if(!result.emailToken || ! result.tokenVaildUntil)
					callback(ErrorService.alreadyValidateEmailError);
				else if(result.tokenVaildUntil < now){
					userModel.findOneAndRemove(result._id, function(){
						callback(ErrorService.activateLateError);	
					});					
				}
				else if( ! _.isEqual(token, result.emailToken))
					callback(ErrorService.tokenNotMatchError);
				else{						
					callback(null,result);
				}
			});			
		},
		function(user, callback){
			user.emailToken = null;
			user.tokenVaildUntil = null;
			user.save(function(err,result){
				if(err) callback(ErrorService.makeDbErr(err));
				else callback(null, DataService.makeUserInfo(result));
			})
		}
	],callback);
	
}

exports.findUserById = function(id, callback){

	DataService.getUserById(id, function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));		
		else{
			callback(null,DataService.makeUserInfo(result));
		}
	});

};

exports.updateUserInfo = function(id, toUser, callback){

	if(toUser.password){
		var md5 = crypto.createHash('md5');
    	toUser.password = md5.update(toUser.password).digest('base64');
	}
	userModel.findOneAndUpdate({'_id':id},{ $set: toUser},function(err){
		if(err) callback(ErrorService.makeDbErr(err));
		else DataService.getUserById(id,callback);
	});

};

exports.getUserPorjects = function(id, callback){	

	async.waterfall([
		function(callback){
			userModel.findById(id)			 
	         .populate('projects')	         
	         .exec(function(err, user){
	         	if(user == null) return callback(ErrorService.userNotFindError)
	         	projectModel.populate(user.projects, {path:'cSprint', select:'_id tasks'}, function(err){
	         		if(err) return callback(ErrorService.makeDbErr(err));
	         		else callback(null, user);
	         	});
	         });
	     },
	     function(user, callback){
	     	var queries = [];
	     	function makeQuery(project){

	     		return function(callback){
		     		sprintModel.populate(project.cSprint, {path:'tasks', select:'_id state progress'}, function(err){
		         		if(err) return callback(ErrorService.makeDbErr(err));
		         		else callback(null, user);
		         	});
	     		}
	     	}
	     	user.projects.forEach(function(project){
	     		project.history = [];	     		
	     		queries.push(makeQuery(project));	
	     	});
	     	
	     	async.parallel(queries,function(err){
				
				if(err) return callback(err);
 				else{
					callback(null, user.projects);
				}
			});	
	     }
	],callback);
	
};

exports.getUserAllTask = function(selfuid, callback){

	taskModel.find({executer: selfuid})
	         .exec(function(err, result){
	         	if(err) callback(ErrorService.makeDbErr(err));
	         	else {
	         		result.history = [];
	         		callback(null, result);
	         	}
	         });

};

exports.getUserCurrentTask = function(selfuid, callback){

	taskModel.find({executer: selfuid})
			 .where('state').ne(1)
	         .exec(function(err, result){
	         	if(err) callback(ErrorService.makeDbErr(err));
	         	else {
	         		result.history = [];
	         		callback(null, result);
	         	}
	         });	         
};

exports.getUserCurrentTaskInProject = function(selfuid, callback){

	async.waterfall([
		function(callback){
			exports.getUserCurrentTask(selfuid, callback);
		},
		function(tasks, callback){
			var lprojects = [];
			var projects = [];
			var fprojects = [];
			var query = [];
			var now = new Date();
			function makeQuery(task){ 
				function pushArray(arr, p){
					var project = null;
					//var project = _.findWhere(arr, {'_id': p._id});
					for(var i=0;i<arr.length;i++)
						if(arr[i]._id.equals(p._id))
							project = arr[i];
					if(!project){
						project = {
							'_id': p._id,
							'name':p.name,
							'task':[]
						};
						project.task.push(task);
						arr.push(project);
					}else{
						project.task.push(task);
					}
					//sails.log.verbose(arr);
				}
				return function(callback){
				sprintModel.findOne({'tasks': task._id},function(err,s){
						if(err) return callback(ErrorService.makeDbErr(err));
						if(!s) return callback(ErrorService.sprintNotFindError);
						projectModel.findOne({'sprints':s._id}, function(err,p){
							if(err) return callback(ErrorService.makeDbErr(err));
							if(!p) return callback(ErrorService.projectNotFindError);
							/*if(task.deadline < now){
								pushArray(lprojects, p);
							} else if(task.startTime < now ) {
								pushArray(projects, p);
							}else{
								pushArray(fprojects, p);
							}*/
							if(!p.cSprint.equals(s._id)) return callback(null);
							pushArray(projects, p);
							callback(null);
						});
					})
				}
			}
			tasks.forEach(function(t){
				query.push(makeQuery(t));
			});
			async.series(query,function(err){
				
				if(err) return callback(err);
 				else{
					callback(null, lprojects, projects, fprojects);
				}
			});	
		}
	],callback);
}

exports.getAllMessage = function(selfuid, callback){

	userModel.findById(selfuid)
			 .populate('messages.from', '_id email name icon')	         
	         .exec(function(err, result){
	         	if(err) callback(ErrorService.makeDbErr(err));
	         	else if(!result) callback(ErrorService.notFindError);
	         	else callback(null, result.messages);
	         });
}

exports.sendMessage = function(selfuid, toUid, message, callback){

	async.waterfall([
		function(callback){
			DataService.getUserById(toUid, callback);
		},
		function(toUser, callback){
			toUser.messages.push({
				from: selfuid,
				message: message,				
			});
			toUser.save(function(err){
				if(err) callback(ErrorService.makeDbErr(err));
				else callback(null);
			})
		}
	],callback);
}

exports.readMessage = function(selfuid, mid, callback){

	DataService.getUserById(selfuid, function(err, user){
		if(err) return callback(err);
		var m = user.messages.id(mid);
		if(!m) return callback(ErrorService.notFindError);
		m.read = true;
		user.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			else callback(null);
		});
	});
}

exports.getAllAlert = function(selfuid, callback){

	DataService.getUserById(selfuid, function(err, user){
		if(err) return callback(err);

		userModel.populate(user.alerts, {path:'from', select:'_id name icon email'}, function(err){
			if(err)return callback(ErrorService.makeDbErr(err));
			else callback(null, user.alerts);
		})			
	})
}

exports.readAlert = function(selfuid, aid, callback){

	DataService.getUserById(selfuid, function(err, user){
		if(err) return callback(err);
		console.log(aid);
		var a = user.alerts.id(aid);
		if(!a) return callback(ErrorService.notFindError);
		a.read = true;
		user.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			else callback(null);
		});
	})
}

exports.deleteAlertById = function(selfuid, aid, callback){
	DataService.getUserById(selfuid, function(err, user){
		if(err) return callback(err);
		console.log(aid);
		var a = user.alerts.id(aid);
		if(!a) return callback(ErrorService.notFindError);
		a.remove();
		user.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			else callback(null);
		});
	})	
}

exports.deleteALLAlert = function(selfuid, callback){
	DataService.getUserById(selfuid, function(err, user){
		if(err) return callback(err);
		user.alerts=[];
		user.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			else callback(null);
		});
	})	
}