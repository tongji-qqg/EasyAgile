/**
 * StoryController
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
var TYPE = 'requirements';
module.exports = {
    /**
	 * get /API/p/:pid/r
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	

    getAllStorys: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/StroyController.getAllStorys');
	    StoryService.getAll(req.params.pid, TYPE, function(err,result){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('requirements', result));
		});
    },

    /**
	 * delete /API/p/:pid/r
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteAllStorys: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/StroyController.deleteAllStorys');
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
    addOneStory: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/StroyController.addOneStory');
	    StoryService.createOne(req.session.user._id, req.params.pid, TYPE, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },
  
    /**
	 * put /API/p/:pid/r/:rid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    modifyOneStory: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/StroyController.modifyOneStory');
	    StoryService.modifyOne(req.session.user._id, req.params.pid, req.params.rid, TYPE, {
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
    modifyAllStory: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/StroyController.modifyAllStory');
	    StoryService.setAll(req.params.pid, TYPE, req.body.requirements, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * delete /API/p/:pid/r/:rid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteOneStory: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/StroyController.deleteOneStory');
	    StoryService.deleteOne(req.session.user._id, req.params.pid, req.params.rid, TYPE, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StroyController)
   */
  _config: {}

  
};
