var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var sprintModel = require('../schemas/sprintSchema');
var taskModel = require('../schemas/taskSchema');
var async = require('async');

function makeWhatOfHistory(arr, what){
	arr.push(what);
}

exports.createTask = function(selfuid, pid, sid, taskInfo, callback){

	async.waterfall([	    


	    function(callback) {

		  	DataService.getSprintById(sid, callback);		    
		},

	    function(sprint, callback){	   
	    	
	    	var task = new taskModel(taskInfo);
	    	/////////////////////////////////////
			//   task history
			/////////////////////////////////////
			var what=[];
			makeWhatOfHistory(what,task.title);
			makeWhatOfHistory(what,task.description);
			makeWhatOfHistory(what,task.startTime);
			makeWhatOfHistory(what,task.deadline);
			makeWhatOfHistory(what,task.type);
			makeWhatOfHistory(what,task.estimate);
			task.history.push({						
				type: HistoryService.TASK_TYPE.create,
				who : selfuid,
				what: what,
				toUser: task.executer
			});
	    	task.save(function(err){
	    		if(err) callback(ErrorService.makeDbErr(err));
	    		else callback(null, sprint, task);
	    	});
	    },
	    function(sprint, task, callback){
	    	sprint.tasks.push(task._id);
	    	/////////////////////////////////////
			//   sprint history
			/////////////////////////////////////
			var what=[];
			makeWhatOfHistory(what,task.title);
			makeWhatOfHistory(what,task.description);
			makeWhatOfHistory(what,task.startTime);
			makeWhatOfHistory(what,task.deadline);
			makeWhatOfHistory(what,task.type);
			makeWhatOfHistory(what,task.estimate);
			sprint.history.push({						
				type: HistoryService.SPRINT_TYPE.task_new,
				who : selfuid,
				what: what
			});
	    	sprint.save(function(err){
	       			if(err) return callback(eErrorService.makeDbErr(err));
	       			else callback(null,task);
	       	});
	    },
	    function(task,callback){
	    	sprintService.collectBurnDownData(null, sid);
	    	callback(null, task);
	    	for(var i=0;i<task.executer.length;i++){
	    		MessageService.sendUserMessage(selfuid, task.executer[i], 
					MessageService.TYPE.assign_task, '把任务<'+task.title+'>分配给你', function(){});	
	    	}	    	
	    }	

	], callback);

};


exports.getTasks = function(selfuid, pid, sid, callback){

	DataService.getTasksInSprint(sid, function(err,sprint){
		if(err) callback(ErrorService.makeDbErr(err));
		else callback(null, sprint.tasks);
	});

};

exports.modifyTaskById = function(selfuid, pid, sid, tid, taskInfo, callback){

	async.waterfall([

	    function(callback) {

		  	DataService.getTaskById(tid, callback);		    
		},

	    function(task, callback){	   
	    	sails.log.verbose('taskInfo.executer '+taskInfo.executer);
	    	task.description = taskInfo.description || task.description;
	    	task.level    = taskInfo.level || task.level ;
	    	task.startTime= taskInfo.startTime || task.startTime;
	    	task.deadline = taskInfo.deadline || task.deadline;
	    	task.title    = taskInfo.title || task.title;
	    	task.type     = taskInfo.type || task.type;
	    	task.state    = taskInfo.state || task.state;
	    	//task.executer = taskInfo.executer || task.executer;
	    	task.progress = taskInfo.progress || task.progress;
	    	task.estimate = taskInfo.estimate || task.estimate;
	    	// if(taskInfo.state){
	    	// 	if(taskInfo.state == 0 )
	    	// 		task.progress = 0;
	    	// 	if(taskInfo.state == 1)
	    	// 		task.progress = 100;
	    	// 	if(task.progress == 0)
	    	// 		task.state = 0;
	    	// 	if(task.progress == 100)
	    	// 		task.state == 1;
	    	// }
	    	/////////////////////////////////////
			//   task history
			/////////////////////////////////////
			if(taskInfo.title || taskInfo.description || task.type || taskInfo.startTime || taskInfo.deadline || taskInfo.deadline ){
				var what=[];
				makeWhatOfHistory(what,task.title);
				makeWhatOfHistory(what,task.description);
				makeWhatOfHistory(what,task.startTime);
				makeWhatOfHistory(what,task.deadline);
				makeWhatOfHistory(what,task.type);
				makeWhatOfHistory(what,task.estimate);
				task.history.push({						
					type: HistoryService.TASK_TYPE.info,
					who : selfuid,
					what: what
				});			
			}
			if(taskInfo.state)
				task.history.push({						
					type: HistoryService.TASK_TYPE.state,
					who : selfuid,
					what: [task.state]
				});
       		task.save(function(err){
       			if(err) return callback(ErrorService.makeDbErr(err));
       			else callback(null,task);
       		});
	    },
	    function(task, callback){
	    	if(taskInfo.estimate)
	    		sprintService.collectBurnDownData(task._id,null);
	    	callback(null,task);
	    }	

	], callback);

};

exports.setTaskProgressById = function(selfuid, pid, sid, tid, progress, callback){

	async.waterfall([
		function(callback){

			if( isNaN(progress))
				return callback(ErrorService.progressScopeError);

			if( progress < 0 || progress > 100)
				return callback(ErrorService.progressScopeError);

			callback(null);
		},
		function(callback){

			DataService.getTaskById(tid, callback);			
		},
	    
	    function(task, callback){	   
	    		   
	    	task.progress = progress;
	    	if(task.progress == 0)
	    		task.state = 0;
	    	if(task.progress == 100)
	    		task.state = 1;
	    	/////////////////////////////////////
			//   task history
			/////////////////////////////////////		
			task.history.push({						
				type: HistoryService.TASK_TYPE.progress,
				who : selfuid,
				what: [progress],
			});

       		task.save(function(err){
       			if(err) return callback(ErrorService.makeDbErr(err));
       			else callback(null,task);
       		});       		
	    },
	    function(task,callback){
	    	sprintService.collectBurnDownData(task._id,null);
	    	callback(null);
	    }	

	], callback);

};


exports.deleteTaskById = function(selfuid, pid, sid, tid, callback){

	async.waterfall([

	    function(callback){

			DataService.getSprintById(sid, callback);		    
	    },
	    function(sprint, callback){
	    	DataService.getTaskById(tid, function(err, task){
	    		if(err) return callback(ErrorService.makeDbErr(err));
	    		else callback(null, sprint, task);
	    	});
	    },
	    function(sprint, task, callback){	   
	    	
	    	taskModel.findByIdAndRemove(tid, function(err){
	    		if(err) return callback(ErrorService.makeDbErr(err));
	    	});	
	    	/////////////////////////////////////
			//   sprint history
			/////////////////////////////////////
			var what=[];			
			makeWhatOfHistory(what,task.title);
			makeWhatOfHistory(what,task.description);
			makeWhatOfHistory(what,task.startTime);
			makeWhatOfHistory(what,task.deadline);
			makeWhatOfHistory(what,task.type);
			makeWhatOfHistory(what,task.estimate);
			sprint.history.push({						
				type: HistoryService.SPRINT_TYPE.task_delete,
				who : selfuid,
				what: what
			});
	    	sprint.tasks.remove(tid);
	    	sprint.backlogs.forEach(function(backlog){
	    		backlog.tasks.remove(tid);
	    	});
       		sprint.save(function(err){
       			if(err) return callback(ErrorService.makeDbErr(err));
       			else callback(null,task);
       		});
	    },
	    function(task, callback){
	    	sprintService.collectBurnDownData(null,sid);
	    	callback(null);
	    	for(var i=0;i<task.executer.length;i++){
	    		MessageService.sendUserMessage(selfuid, task.executer[i], 
					MessageService.TYPE.task_delete, '把你负责的任务<'+task.title+'>删除', function(){});	
	    	}	
	    }	

	], callback);

};

exports.setTaskToBacklog = function(sid, bid, tid, callback){
	async.waterfall([

	    function(callback){

			DataService.getSprintById(sid, callback);		    
	    },
	    
	    function(sprint, callback){	   
	    		    	    		    	
	    	sprint.backlogs.forEach(function(backlog){
	    		backlog.tasks.remove(tid);
	    	});

	    	if(bid){ //bid is not null
	    		var backlog = sprint.backlogs.id(bid);
	    		if(!backlog) return callback(ErrorService.backlogNotFindError);
	    		backlog.tasks.push(tid);
	    	}
       		sprint.save(function(err){
       			if(err) return callback(ErrorService.makeDbErr(err));
       			else callback(null);
       		});
	    }	

	], callback);
}

exports.assignMemberToTask = function(selfuid, pid, sid, tid, uid, callback){

	async.waterfall([		

	    function(callback){
	    	
	    	AuthService.hasProjectAccess(uid, pid, function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    },

	    function(callback) {

		  	DataService.getSprintById(sid, callback);	    
		},

		function(sprint, callback){

			DataService.getTaskById(tid,function(err,task){
				if(err) return callback(err);
				var pos = DataService.getArrayIndexByObjectId(sprint.tasks, task._id);
				if(pos == -1) return callback(ErrorService.taskNotFindError);
				else callback(null, task);	
			})
			
		},
	    function(task, callback){	  

	    	var pos = DataService.getArrayIndexByObjectId(task.executer, uid);	    	
	    	if(pos != -1) return callback(null);

	    	task.executer.push(uid);
	  		/////////////////////////////////////
			//   task history
			/////////////////////////////////////		
			task.history.push({						
				type: HistoryService.TASK_TYPE.assign,
				who : selfuid,
				toUser: [uid],
			});
       		task.save(function(err){
       			if(err) return callback(ErrorService.makeDbErr(err));
       			else callback(null);
       		});
       		MessageService.sendUserMessage(selfuid, uid, 
					MessageService.TYPE.assign_task, '把任务<'+task.title+'>分配给你', function(){});	
	    }	

	], callback);

};


exports.removeMemberFromTask = function(selfuid, pid, sid, tid, uid, callback){

	async.waterfall([

		function(callback){
	    	
	    	AuthService.hasProjectAccess(uid, pid, function(err){
	    		if(err) callback(ErrorService.makeDbErr(err));
	    		else callback(null);
	    	});
	    },

	    function(callback) {

		  	DataService.getSprintById(sid, callback);
		},

		function(sprint, callback){
			
			DataService.getTaskById(tid,function(err,task){
				if(err) return callback(err);
				var pos = DataService.getArrayIndexByObjectId(sprint.tasks, task._id);
				if(pos == -1) return callback(ErrorService.taskNotFindError);
				else callback(null, task);	
			})
			
		},

	    function(task, callback){	   
	    	
	    	var pos = DataService.getArrayIndexByObjectId(task.executer, uid);
	    	if(pos == -1) return callback(null);	    	

	    	task.executer.remove(uid);
	    	/////////////////////////////////////
			//   task history
			/////////////////////////////////////		
			task.history.push({						
				type: HistoryService.TASK_TYPE.remove,
				who : selfuid,
				toUser: [uid],
			});
       		task.save(function(err){
       			if(err) return callback(ErrorService.makeDbErr(err));
       			else callback(null);
       		});
       		MessageService.sendUserMessage(selfuid, uid, 
					MessageService.TYPE.remove_task, '把任务<'+task.title+'>取消分配给你', function(){});	
	    }	

	], callback);

};