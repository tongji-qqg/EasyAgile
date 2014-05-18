var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel  =  require('../schemas/taskSchema');

var async = require('async');


exports.createSprint = function (selfuid, pid, sprintInfo, cb){
	
	async.waterfall([

	    function(callback){

			DataService.getProjectById(pid, callback);       
	    },

	    function(targetProject, callback) {

	    	var sprint = new sprintModel(sprintInfo);
	    	sprint.save(function(err){
	    		if(err) callback(ErrorService.makeDbErr(err));
	    		else callback(null, targetProject, sprint);
	    	});
	    },

	    function(targetProject, newSprint, callback){	   
	    	
	    	targetProject.sprints.push(newSprint._id);

	    	targetProject.save(function(err){
	    		if(err) callback(ErrorService.makeDbErr(err));
	    		else callback(null, newSprint);
	    	});
	    }	

	], cb);

};

exports.deleteSprint = function(selfuid, pid, sid, cb){

	sprintModel.findById(sid, function(err, sprint){
		if(err) return callback(ErrorService.makeDbErr(err));	
		if(!sprint) return callback(ErrorService.sprintNotFindError);
		sprint.deleted = true;
		sprint.save(function(err){
			if(err) callback(ErrorService.makeDbErr(err));
			callback(null);
		})
	});	    		    				    	
};

exports.getSprintListOfProject = function(selfuid, pid, callback){

	projectModel.findOne({'_id':pid})
					    .populate('sprints', '_id name description createTime startTime endTime state deleted')						    				   
					    .exec(function(err, project){
					    	if(err) callback(ErrorService.makeDbErr(err));
					    	else callback(null, project.sprints);					    	
					    });			 						    			     	
};

exports.getSprintById = function(selfuid, pid, sid, callback){
	
	async.waterfall([
		function(callback){
			sprintModel.findOne({'_id':sid})
				.populate('tasks')
			    .exec(function(err, sprint){
			    	if(err) callback(ErrorService.makeDbErr(err));
			    	else callback(null, sprint);
			    });		
		},
		function(sprint, callback){
			var queries = [];
	     	function makeQuery(task){

	     		return function(callback){
		     		taskModel.populate(task, {path:'executer', select:'_id name icon'}, function(err){
		         		if(err) return callback(ErrorService.makeDbErr(err));
		         		else callback(null);
		         	});
	     		}
	     	}
	     	sprint.tasks.forEach(function(task){
	     		queries.push(makeQuery(task));	
	     	});
	     	
	     	async.parallel(queries,function(err){
				
				if(err) return callback(err);
 				else{
					callback(null, sprint);
				}
			});	
		}
	],callback);					
	
}


exports.modifySprintById = function(selfuid, pid, sid, sprintInfo, callback){
	    
	sprintModel.findOneAndUpdate({'_id':sid},{ $set: sprintInfo},function(err){
		if(err) callback(ErrorService.makeDbErr(err));
		else callback(null);
	});	 						    			     	
};

exports.setSprintState = function (selfuid, pid, sid, state, callback){

	sprintModel.findOneAndUpdate({'_id':sid},{ $set: {state: state}},function(err){
		if(err) callback(ErrorService.makeDbErr(err));
		else callback(null);
	});	 				
};

exports.setCurrentSprint = function(selfuid, pid, sid, callback){

	async.waterfall([
		function(callback){
			DataService.getProjectById(pid, callback);
		},
		function(project, callback){
			project.cSprint = sid;
			project.save(function(err){
				if(err)callback(ErrorService.makeDbErr(err));
				else callback(null);
			})
		}
	],callback);
}