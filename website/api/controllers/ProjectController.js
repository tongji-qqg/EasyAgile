/**
 * ProjectController
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
	 * post /API/p
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    createProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.createProject');
	    projectService.createProject(req.session.user._id, req.body.name, req.body.des, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);	
		});
    },
  
    /**
	 * post /API/p
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getProjectInfo: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.getProjectInfo');
	    projectService.findProjectInfoById(req.params.pid, function(err,result){
			
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('project', result));
		});
    },

    /**
	 * put /API/p/pid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    editProjectInfo: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.editProjectInfo');
	    var toProject = {};
		if(req.body.name) toProject.name = req.body.name;
		if(req.body.des)  toProject.description = req.body.des;
		if(req.body.endTime) toProject.endTime = req.body.endTime;
		if(toProject === {}) res.json(ErrorService.success);

		projectService.updateProjectInfo(req.params.pid, toProject, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * put /API/pf/:pid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    finishProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.finishProject');
	    projectService.updateProjectInfo(req.params.pid, {realEndTime:new Date, done:true}, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * delete /API/pf/:pid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.deleteProject');
	    projectService.updateProjectInfo(req.params.pid, {deleted: true}, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * post /API/p/:pid/mid/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    inviteMemberById: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.inviteMemberById');
	    projectService.addMemberById(req.session.user._id, req.params.pid, req.params.uid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * post /API/p/:pid/me/:email
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    inviteMemberByEmail: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.inviteMemberByEmail');
	    projectService.addMemberById(req.session.user._id, req.params.pid, req.params.uid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * delete /API/p/:pid/mid/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    removeMemberById: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.removeMemberById');
	    projectService.removeMemberById(req.session.user._id, req.params.pid, req.params.uid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

     /**
	 * put /API/p/:pid/ma/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    setMemberAdmin: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.setMemberAdmin');
	    projectService.setAdmin(req.params.pid, req.params.uid, true, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },


     /**
	 * delete /API/p/:pid/ma/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    removeMemberAdmin: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/ProjectController.removeMemberAdmin');
	    projectService.setAdmin(req.params.pid, req.params.uid, false, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProjectController)
   */
  _config: {}

  
};
