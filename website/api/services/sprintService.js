var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel  =  require('../schemas/taskSchema');

var async = require('async');
var _ = require('underscore');

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

function formatDate(date){
	return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
}
exports.collectBurnDownData = function(tid,sid){
	//sails.log.warn('collectBurnDownData tid: '+tid +" sid "+sid);
	async.waterfall([
		function(callback){
			if(tid){
				sprintModel.findOne({'tasks':tid})
						   .populate('tasks')
						   .exec(function(err,sprint){
								if(err) return callback(ErrorService.makeDbErr(err));
								if(!sprint) return callback(ErrorService.sprintNotFindError);								
								callback(null, sprint);
							});
			}
			else{
				sprintModel.findOne({'_id':sid})
						   .populate('tasks')
						   .exec(function(err,sprint){
								if(err) return callback(ErrorService.makeDbErr(err));
								if(!sprint) return callback(ErrorService.sprintNotFindError);								
								callback(null, sprint);
							});	
			}
		},
		
		function(sprint, callback){					
			var today = new Date(formatDate(new Date()));
			if(!sprint.burndown) sprint.burndown = [];
			var data ;
			for(var i=0;i<sprint.burndown.length;i++){
				if(sprint.burndown[i].date.getTime() == today.getTime()){
					data = sprint.burndown[i];
					break;
				}					
			}
			sails.log.warn(data);
			if(!data){
				data = {
					date:today,
					remain:0
				};
				sprint.burndown.push(data); //objects are pushed by ref
			}
			var remain = 0;
			
			if(sprint.tasks){
				sprint.tasks.forEach(function(t){
					remain+= t.estimate * (100 - t.progress) / 100;
				});
			}
			data.remain = remain;
			callback(null);
			// console.log(sprint);
			// console.log(remain);
			sprint.save(function(err){
				if(err)callback(err);
				else callback(null);
			})
		}
	],function(err){
		if(err)sails.log.err('collectBurnDownData error');
		else sails.log.verbose('collectBurnDownData success');
	})
}