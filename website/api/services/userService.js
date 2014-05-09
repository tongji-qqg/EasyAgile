
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel = require('../schemas/taskSchema');
var projectModel = require('../schemas/projectSchema');

var _  = require('underscore');

var async = require('async');

var errorDef = require('./errorDefine');

exports.register = function(userInfo, callback){		

	async.waterfall([
		function(callback){
			var user = new userModel(userInfo);
			user.save(function(err, result){
				if(err) return callback(ErrorService.makeDbErr(err));	
				callback(null);	
			});					
		},

		function(callback){			
			DataService.getUserByEmail(userInfo.email, callback);
		}
	],callback);		
};

exports.findUserByEmail = function(email, callback){

	DataService.getUserByEmail(email, function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));
		else{			
			callback(null,DataService.makeUserInfo(result));
		}
	});

};

exports.findUserLikeName = function(name, callback){

	userModel.find({name:new RegExp('\w*'+name+'\w*', "i")}, function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));
		if(!result) return callback(ErrorService.userNotFindError);
		else{			
			var users = [];
			result.forEach(function(r){
				users.push(DataService.makeUserInfo(r));
			});
			callback(null,users);
		}
	});

};

exports.loginByEmail = function(email, password, callback){

	DataService.getUserByEmail(email, function(err, result){
		if(err) return callback(ErrorService.makeDbErr(err));
		
		else if( ! _.isEqual(password, result.password))
			callback(ErrorService.passwordNotRightError);
		else{						
			callback(null,DataService.makeUserInfo(result));
		}
	});

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
	         	else callback(null, result);
	         });

};

exports.getUserCurrentTask = function(selfuid, callback){

	taskModel.find({executer: selfuid})
			 .where('state').ne(1)
	         .exec(function(err, result){
	         	if(err) callback(ErrorService.makeDbErr(err));
	         	else callback(null, result);
	         });	         
};

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
		if(err) callback(err);
		else callback(null, user.alerts);
	})
}

exports.readAlert = function(selfuid, aid, callback){

	DataService.getUserById(selfuid, function(err, user){
		if(err) return callback(err);
		var a = user.alerts.id(aid);
		if(!a) return callback(ErrorService.notFindError);
		a.read = true;
		user.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			else callback(null);
		});
	})
}