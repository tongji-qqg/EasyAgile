/**
 * IssueController
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
var TYPE = 'issues';
module.exports = {
	/**
	 * get /API/p/:pid/i
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getAllIssues: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/IssueController.getAllIssues');
	    StoryService.getAll(req.params.pid, TYPE, function(err,result){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('issues', result));
		});
    },

    /**
	 * delete /API/p/:pid/r
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteAllIssues: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/IssueController.deleteAllIssues');
	    StoryService.deleteAll(req.params.pid, TYPE, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },
  

    /**
	 * post /API/p/:pid/r
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    addOneIssue: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/IssueController.addOneIssue');
	    StoryService.createOne(req.params.pid, TYPE, {
			description: req.body.description, 
			level: req.body.level,
			finder: req.session.user._id
		},function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },
  
    /**
	 * put /API/p/:pid/r/:iid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    modifyOneIssue: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/IssueController.modifyOneIssue');
	    StoryService.modifyOne(req.params.pid, req.params.iid, TYPE, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * put /API/p/:pid/r
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    modifyAllIssue: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/IssueController.modifyAllIssue');
	    StoryService.setAll(req.params.pid, TYPE, req.body.requirements, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * delete /API/p/:pid/r/:iid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteOneIssue: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/IssueController.deleteOneIssue');
	    StoryService.deleteOne(req.params.pid, req.params.iid, TYPE, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to IssueController)
   */
  _config: {}

  
};
