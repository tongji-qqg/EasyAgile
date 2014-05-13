/**
 * BacklogController
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
var TYPE = {
	b:'backlogs'
}
module.exports = {
    
    /**
	 * get /API/p/:pid/s/:sid/backlog
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getBacklogOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/BacklogController.getBacklogOfProject');
	    backlogService.getAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err, backlog){
				
				if(err) res.json(err);
				else res.json(ErrorService.successWithValue('backlog', backlog));
		});
    },
  
  	/**
	 * post /API/p/:pid/s/:sid/backlog
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    addBacklogOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/BacklogController.addBacklogOfProject');
	    backlogService.createOne(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, {
			description: req.body.description,
			level: req.body.level,
			estimate: req.body.estimate,
			title : req.body.title
		},function(err){
			if(err) res.json(err);
			else{
			 	res.json(ErrorService.success);
			 	SocketService.updateSprint(req,res);
			 }
		});
    },

    /**
	 * put /API/p/:pid/s/:sid/b/:bid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    modifyBacklogOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/BacklogController.modifyBacklogOfProject');
	    backlogService.modifyOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b, {
			description: req.body.description,
			level: req.body.level,
			estimate: req.body.estimate,
			title : req.body.title
		},function(err){
			if(err) res.json(err);
			else{
				sails.log.warn(sails.io.sockets.clients());
				sails.log.warn(sails.io.sockets.clients('sprintId_'+req.params.sid));
				SocketService.updateSprint(req,res);
			 	res.json(ErrorService.success);
			}
		});
    },

    /**
	 * put /API/p/:pid/s/:sid/b
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    modifyAllBacklogOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/BacklogController.modifyAllBacklogOfProject');
	    backlogService.setAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, req.body.backlog,
			function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * delete /API/p/:pid/s/:sid/b/:bid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteBacklogOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/BacklogController.deleteBacklogOfProject');
	    backlogService.deleteOne(req.session.user._id, req.params.pid, req.params.sid, req.params.bid, TYPE.b,
			function(err){
			if(err) res.json(err);
			else {
				res.json(ErrorService.success);
				SocketService.updateSprint(req,res);
			}
		});
    },

    /**
	 * delete /API/p/:pid/s/:sid/b
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteAllBacklogOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/BacklogController.deleteAllBacklogOfProject');
	    backlogService.deleteAll(req.session.user._id, req.params.pid, req.params.sid, TYPE.b, 
			function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BacklogController)
   */
  _config: {}

  
};
