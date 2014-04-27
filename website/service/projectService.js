
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');


Array.prototype.removeByPos = function(from, to) {
	console.log('here');
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


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
/*
var getIndexBy = function (array, name, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][name].equals(value)) {
            return i;
        }
    }
    return -1;
}
*/



exports.createProject = function(name, des, creater,callback){

	var project = new projectModel({
		name: name,
		description: des,
		owner:{
			_id  : creater._id,
			name : creater.name,
			icon : creater.icon
		}
	});
	project.save(callback);
};

exports.findProjectInfoById = function(id, callback) {
	projectModel.findById(id, function(err, result){
		if(err) callback(databaseError);
		if(result == null) callback(projectNotFindError);
		else{
			var project = {
				_id: result._id,				
				name: result.name,
				des: result.description,
				createTime:	result.createTime,
				endTime: result.endTime,
				realEndTime: result.realEndTim,
				done: result.done,
				owner:{
					_id: result.owner._id,
					name: result.owner.name,
					icon: result.owner.icon
				}			
			};
			callback(null,project);
		}
	});
};




function findUser(uid, callback){
	userModel.findById(uid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(userNotFindError);
				else callback(null,result);				
			});
}

//different with same name func in rrService.js
function findProject(pid, member, callback){
	projectModel.findById(pid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(projectNotFindError);
				else callback(null, member, result);				
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

}


exports.updateProjectInfo = function(selfuid, pid, toProject, cb){

	async.waterfall([
	    
	    function(callback){
			projectModel.findById(pid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(projectNotFindError);
				else callback(null,result);				
			});	        
	    },

	    function(targetProject, callback){	   
	    	
	    	checkAdmin(selfuid,targetProject,callback);
	    },	

	    function(targetProject, callback){	   

			projectModel.findOneAndUpdate({'_id':pid},{ $set: toProject},function(err){
				if(err) callback(err);
				else callback(null);
			});
	    }	
	   
	], cb);
	

};

exports.finishProject = function(selfuid, pid, cb){

	async.waterfall([
	    
	    function(callback){
			projectModel.findById(pid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(projectNotFindError);
				else callback(null,result);				
			});	        
	    },

	    function(targetProject, callback){	   
	    	
	    	checkAdmin(selfuid,targetProject,callback);
	    },	

	    function(targetProject, callback){	   

			projectModel.findOneAndUpdate({'_id':pid},{ $set: {realEndTime:new Date, done:true} }, function(err){
				if(err) callback(err);
				else callback(null);
			});
	    }	
	   
	], cb);
	

};


exports.addMemberById = function(selfuid,pid, uid, cb){

	async.waterfall([

	    function(callback){
	    	findUser(uid, callback);
	    },
	    
	    function(newMember, callback){
			findProject(pid, newMember, callback);       
	    },

	    function(newMember, targetProject, callback){	    	
	    	
	    	checkAdmin(selfuid,targetProject,callback);

	    	if(targetProject.owner._id.equals(newMember._id)){
	    		return callback(alreadyOwnerError);	    		
	    	}
	    	var member;
	    	member = targetProject.members.id(uid);
	    	if(member != null ) return callback(alreadyMemberError);
	    		    	   
	    	callback(null,newMember,targetProject);
	    },

	    function(newMember, targetProject, callback){
	    	targetProject.members.push({
	    		_id: newMember._id,
	    		name: newMember.name,
	    		icon: newMember.icon,
	    		isAdmin: false
	    	});
	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }

	], cb);

};



exports.removeMemberById = function(selfuid,pid, uid, cb){

	async.waterfall([

	    function(callback){
	    	findUser(uid, callback);
	    },
	    
	    function(toDelMember, callback){
			findProject(pid, toDelMember, callback);        
	    },

	    function(toDelMember, targetProject, callback){	    	
	    	
	    	checkAdmin(selfuid,targetProject,callback);

	    	if(targetProject.owner._id.equals(toDelMember._id)){
	    		return callback(cannotRemoveOwnerError);	    		
	    	}

	    	var member;
	    	member = targetProject.members.id(uid);
	    	if(member == null ) return callback(memberNotFindError);	    	
	    		    		    	
	    	callback(null,toDelMember,targetProject);
	    },

	    function(toDelMember, targetProject, callback){
	    	
	    	var member;
	    	member = targetProject.members.id(uid);
	    	if(member == null ) return callback(memberNotFindError);	    	


	    	member.remove();
	    	
	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }

	], cb);

};

exports.setAdmin = function(selfuid, pid, uid, bSet, cb){

	async.waterfall([
	    
	    function(callback){
			projectModel.findById(pid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(projectNotFindError);
				else callback(null,result);				
			});	        
	    },

	    function(targetProject, callback){	   
	    	
	    	checkAdmin(selfuid,targetProject,callback);
	    },	

	    function(targetProject, callback){	   

	    	var member = targetProject.members.id(uid);
	    	if(member == null) return callback(memberNotFindError);

	    	member.isAdmin = bSet;

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	
	   
	], cb);

};