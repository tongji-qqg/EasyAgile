/**
 * TaskController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
"use strict";
module.exports = {
    /**
	 * get /API/p/:pid/s/:sid/tasks
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getTasksOfSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.getTasksOfSprint');
	    taskService.getTasks(req.session.user._id, req.params.pid, req.params.sid, function(err, tasks){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('tasks', tasks));
		});
    },
  	
  	/**
	 * post /API/p/:pid/s/:sid/tasks
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    addTaskOfSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.addTaskOfSprint');
	    taskService.createTask(req.session.user._id, req.params.pid, req.params.sid, {
			title      : req.body.title,
			description: req.body.description,
			deadline   : req.body.deadline,
			level      : req.body.level
		}, function(err, task){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('task', task));
		});
    },

    /**
	 * put /API/p/:pid/s/:sid/t/:tid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    modifyTaskOfSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.modifySprintOfSprint');
	    taskService.modifyTaskById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, {
			description: req.body.description,
			deadline   : req.body.deadline,
			level      : req.body.level,
			title      : req.body.title
		}, function(err,task){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('task', task));
		});
    },

    /**
	 * put /API/p/:pid/s/:sid/t/:tid/progress
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    setTaskProgress: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.setTaskProgress');
	    taskService.setTaskProgressById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, 
			req.body.progress, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * put /API/p/:pid/s/:sid/t/:tid/b/:bid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    setTaskToBacklog: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.setTaskToBacklog');
	    taskService.setTaskToBacklog(req.params.sid, req.params.bid, req.params.tid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * put /API/p/:pid/s/:sid/t/:tid/nob
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    unsetTaskToBacklog: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.setTaskToBacklog');
	    taskService.setTaskToBacklog(req.params.sid, null, req.params.tid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * delete /API/p/:pid/s/:sid/t/:tid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteTaskOfSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.deleteTaskOfSprint');
	    taskService.deleteTaskById(req.session.user._id, req.params.pid, req.params.sid, req.params.tid, 
			function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * put /API/p/:pid/s/:sid/t/:tid/u/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    assignTaskToMember: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.assignTaskToMember');
		taskService.assignMemberToTask(req.session.user._id, req.params.pid, req.params.sid, req.params.tid,
			req.params.uid, function(err){
				if(err) res.json(err);
				else res.json(ErrorService.success);
			});
	    
    },

    /**
	 * delete /API/p/:pid/s/:sid/t/:tid/u/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    removeTaskFromMember: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TaskController.removeTaskFromMember');
	    taskService.removeMemberFromTask(req.session.user._id, req.params.pid, req.params.sid, req.params.tid,
			req.params.uid, function(err){
				if(err) res.json(err);
				else res.json(ErrorService.success);
			});
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TaskController)
   */
  _config: {}

  
};
