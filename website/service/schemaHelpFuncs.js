var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var errorDef = require('./errorDefine');

var getArrayIndexByObjectId = function (array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].equals(id)) {
            return i;
        }
    }
    return -1;
};

exports.getArrayIndexByObjectId = getArrayIndexByObjectId;

exports.findProject = function(pid, callback){
	projectModel.findById(pid, function(err, result){
				if(err) return callback(errorDef.databaseError);
				if(result == null) callback(errorDef.projectNotFindError);
				else callback(null,result);				
			});
}

exports.findSprint = function(targetProject, sid, callback){
	var pos = getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);

	sprintModel.findById(sid,function(err,sprint){
	           		if(err) return callback(err);
	           		if(sprint == null) callback(errorDef.sprintNotFindError);
	           		else callback(null, sprint)
	           });
}

exports.findSprintTasks = function(targetProject, sid, callback){
	var pos = getArrayIndexByObjectId(targetProject.sprints, sid);
	    	if(pos == -1) return callback(errorDef.sprintNotFindError);

	sprintModel.findById(sid)
			   .populate('tasks')
			   .exec(function(err,sprint){
	           		if(err) return callback(err);
	           		if(sprint == null) callback(errorDef.sprintNotFindError);
	           		else callback(null, sprint)
	           });
}

exports.checkAdmin = function(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null && member.isAdmin)
		permissin = true;
	
	if( !permission )return callback(errorDef.notAdminError);	    	
	callback(null, targetProject);
}

exports.checkMember = function(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null)
		permissin = true;
	
	if( !permission )return callback(errorDef.notAdminError);	    	
	callback(null, targetProject);
}

exports.findUser = function(uid, targetProject, callback){
	userModel.findById(uid, function(err, result){
				if(err) return callback(errorDef.databaseError);
				if(result == null) callback(errorDef.userNotFindError);
				else callback(null, targetProject, result);				
			});
}
