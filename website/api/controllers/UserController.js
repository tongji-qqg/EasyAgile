/**
 * UserController
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
	 * get /API/u/name/:name
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getUserInfoLikeName: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/UserController.getUserInfoLikeName');
	    userService.findUserLikeName(req.params.name, function(err, result){
			if(err)
				res.json(err);
			else
				res.json(ErrorService.successWithValue('user', result));
		});
    },

    /**
     * get /API/u/email/:email
     * 
     * @param   {req}   request     Request object
     * @param   {res}  response    Response object
     */
    getUserInfoByEmail: function (req, res) {
      	sails.log.verbose('Controller - api/controller/UserController.getUserInfoByEmail');
    	userService.findUserByEmail(req.params.email, function(err, result){
			if(err)
				res.json(err);
			else
				res.json(ErrorService.successWithValue('user', result));
		});
	},

	/**
	 * get /API/u
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getUserInfoById: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getUserInfoById');
		userService.findUserById(req.session.user._id, function(err,result){
			if(err) res.json(err);
				else res.json(ErrorService.successWithValue('user', result));
			});
	},

	/**
	 * post /API/u
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	validateUserByEmail: function (req, res) {
	    sails.log.verbose('Controller - api/controller/UserController.validateUserByEmail');
		userService.loginByEmail(req.body.emailaddress, req.body.password,function(err,result){
			if(err) res.json(err);
			else{
				req.session.user = result;
				
				res.json(ErrorService.successWithValue('user', result));
			}
		});
	},
	
	/**
	 * put /API/u/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	editUserInfoById: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.editUserInfoById');
		var targetUser = {					
		};
		if(req.body.name)targetUser.name = req.body.name;
		if(req.body.icon)targetUser.icon = req.body.icon;
		if(req.body.phone)targetUser.phone = req.body.phone;
		if(req.body.birthday)targetUser.birthday = req.body.birthday;

		if(targetUser === {}) return res.json(ErrorService.success);
		userService.updateUserInfo(req.session.user._id, targetUser, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
	},

	/**
	 * put /API/u/pw/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	changePasswordById: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.changePasswordById');
		if(req.body.password == null)
			return res.json(err);
		userService.updateUserInfo(req.session.user._id, { password: req.body.password }, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});		
	},

	/**
	 * get /API/u/:uid/tasks/all
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getAllUserTask: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getAllUserTask');
		userService.getUserAllTask(req.session.user._id, function(err, result){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('tasks', result));
		})
	},

	/**
	 * get /API/u/:uid/tasks/current
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getCurrentUserTask: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getCurrentUserTask');
		userService.getUserCurrentTask(req.session.user._id, function(err, result){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('tasks', result));
		});
	},

	/**
	 * get /API/u/:uid/projects
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getUserProjects: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getUserProjects');
		userService.getUserPorjects(req.session.user._id, function(err, projects){
			if(err) res.json(err);
			else{ 				
				res.json(ErrorService.successWithValue('projects', projects));
			}
		});
	},

	/**
	 * get  /API/m
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getUserMessage: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getUserMessage');
		userService.getAllMessage(req.session.user._id, function(err, result){
			if(err) res.json(err);
			else{
				result = _.without(result, _.findWhere(result, {read:true}));
				res.json(ErrorService.successWithValue('messages', result));
			}
		});
	},

	/**
	 * post /API/m/u/:uid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	sendMessage: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.sendMessage');
		userService.sendMessage(req.session.user._id, req.params.uid, req.body.message, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
	},

	/**
	 * get /API/ma
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getAllUserMessage: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getAllUserMessage');
		userService.getAllMessage(req.session.user._id, function(err,result){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('messages',result));
		});
	},

	/**
	 * put  /API/m/:mid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	readMessage: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.readMessage');
		userService.readMessage(req.session.user._id, req.params.mid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
	},

	/**
	 * get  /API/a
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getUserAlert: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getUserAlert');
		userService.getAllAlert(req.session.user._id, function(err, result){
			if(err) res.json(err);
			else{
				result = _.without(result, _.findWhere(result, {read:true}));
				res.json(ErrorService.successWithValue('alert', result));
			}
		});
	},

	/**
	 * get  /API/aa
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	getAllUserAlert: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.getAllUserAlert');
		userService.getAllAlert(req.session.user._id, function(err,result){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('alert',result));
		});
	},

	/**
	 * put  /API/a/:aid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
	readAlert: function (req, res) {
	   	sails.log.verbose('Controller - api/controller/UserController.readAlert');
		userService.readAlert(req.session.user._id, req.params.mid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  
};
