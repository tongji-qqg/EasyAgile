/**
 * SprintController
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
	 * get /API/p/:pid/s
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getAllSprints: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/SprintController.getAllSprints');
	    sprintService.getSprintListOfProject(req.session.user._id, req.params.pid, function(err, sprints){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('sprints', sprints));
		})
    },
  
    /**
	 * get /API/p/:pid/s/:sid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getOneSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/SprintController.getOneSprint');
	    sprintService.getSprintById(req.session.user._id, req.params.pid, req.params.sid, 
			function(err, sprint){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('sprint', sprint));
		})
    },

    /**
	 * post /API/p/:pid/s
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    createSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/SprintController.createSprint');
	    var sprintInfo = {
			name: req.body.name,
			description: req.body.description,
			startTime:req.body.startTime,
			endTime:req.body.endTime
		};
		if(req.body.endTime) sprintInfo.endTime = req.body.endTime;
		if(req.body.startTime){
		 	sprintInfo.startTime = req.body.startTime;		 	
		}
		sprintService.createSprint(req.session.user._id, req.params.pid, sprintInfo,function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});		
    },

    /**
	 * delete /API/p/:pid/s/:sid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/SprintController.deleteSprint');
	    sprintService.deleteSprint(req.session.user._id, req.params.pid, req.params.sid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});			
    },

    /**
	 * put /API/p/:pid/s/:sid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    modifySprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/SprintController.modifySprint');
	    sails.log.warn(req.body.endTime);
	    sprintService.modifySprintById(req.session.user._id, req.params.pid, req.params.sid, {
			name: req.body.name,
			description: req.body.description,
			startTime:req.body.startTime,
			endTime:req.body.endTime
		}, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});				
    },

    /**
	 * get /API/p/:pid/s/:sid/start
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    startSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/SprintController.startSprint');
	    /*sprintService.setSprintState(req.session.user._id, req.params.pid, req.params.sid, 1, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
		*/
		sprintService.setCurrentSprint(req.session.user._id, req.params.pid, req.params.sid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		})	
    },

    /**
	 * get /API/p/:pid/s/:sid/finish
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    finishSprint: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/SprintController.finishSprint');
	    sprintService.setSprintState(req.session.user._id, req.params.pid, req.params.sid, 2, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});		
    },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SprintController)
   */
  _config: {}

  
};
