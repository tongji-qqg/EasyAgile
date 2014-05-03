
var userModel = require('../schemas/userSchema');

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
				if(err) callback(err);		
			});		
			callback(null);
		},

		function(callback){			
			exports.findUserByEmail(userInfo.email, function(err, result){
				if(err) callback(err);
				else callback(null, result);
			});
		}
	],callback);		
};

exports.findUserByEmail = function(email, callback){

	userModel.findOne({ 'email' : email }, function(err, result){
		if(err) return callback(errorDef.databaseError);
		if(result == null) callback(errorDef.userNotFindError);
		else{
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

};

exports.loginByEmail = function(email, password, callback){

	userModel.findOne({ 'email' : email }, function(err, result){		
		if(err) 
			callback(errorDef.databaseError);
		else if(result == null) 
			callback(errorDef.userNotFindError);
		else if( ! _.isEqual(password, result.password))
			callback(errorDef.passwordNotRightError);
		else{			
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

}

exports.findUserById = function(id, callback){

	userModel.findById(id, function(err, result){
		if(err) return callback(errorDef.databaseError);
		if(result == null) callback(errorDef.userNotFindError);
		else{
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

};

exports.updateUserInfo = function(id, toUser, callback){

	userModel.findOneAndUpdate({'_id':id},{ $set: toUser},callback);

};

exports.getUserPorjects = function(id, callback){

	async.waterfall([

		function(callback){
			userModel.findById(id)			     
			         .exec(function(err, result){
						if(err) callback(err);
						if(result == null) callback(errorDef.userNotFindError);
						else{
							callback(null, result);
						}				
				});
		},
		function(user, callback){
			var projects = [];
			var queries = [];
			var makeQuery = function(project){
				return function(callback){
					projectModel.findById(project)
								  .populate('cSprint', 'taskTotal taskFinish')						  								 
								  .select('_id name description cSprint createTime owner done')
								  .exec(function(err, p){						  	
								  	if(err)
								  		return callback(err);						  	
							  		if(p)
							  		{							  			
							  			projects.push(p);
						  			}
						  			callback();							  		
								  });					
				}
			}; 
			
			user.projects.forEach( function(c){
				queries.push(makeQuery(c));
			});
			
			async.parallel(queries,function(err){
				
				if(err) return callback(err);
								
				else{					
					callback(null, projects);
				}
			});		
		}		
	],callback);
};

exports.getUserAllTask = function(selfuid, callback){

	taskModel.find({executer: selfuid})
	         .exec(function(err, result){
	         	if(err) callback(err);
	         	else callback(null, result);
	         });

};

exports.getUserCurrentTask = function(selfuid, callback){

	taskModel.find({executer: selfuid})
			 .where('done').equals(false)
	         .exec(function(err, result){
	         	if(err) callback(err);
	         	else callback(null, result);
	         });	         
};