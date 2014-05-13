/**
 * StaticController
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

var F = require('./functions');
module.exports = {
    
  
  /**
   * get /
   * 
   * @param   {Request}   request     Request object
   * @param   {Response}  response    Response object
   */
  index: function (req, res) {
    
    sails.log.verbose('Controller - api/controller/StaticController.index');
    return res.view('index',{
      user:req.session.user
    });
  },


  /**
   * get /reg 
   * 
   * @param   {Request}   request     Request object
   * @param   {Response}  response    Response object
   */
  reg: function (req, res) {
        
    sails.log.verbose('Controller - api/controller/StaticController.reg');
    return res.view('auth/signup');
  },

  /**
   * Login page
   *
   * @param   {Request}   request     Request object
   * @param   {Response}  response    Response object
   */
  login: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.login');      
      res.view('auth/login');
  },

  /**
   * get user main page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  userMain: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.userMain');      
      res.view('user/user_project',{               
          user:req.session.user,                
        });
  },


  /**
   * get user task page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  userTask: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.userTask');      
      res.view('user/user_task',{               
          user:req.session.user,                
        });
  },

  /**
   * get user schedule page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  userCal: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.userCal');      
      res.view('user/user_cal',{               
          user:req.session.user,                
        });
  },

  /**
   * get user main message action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  userMessage: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.userMessage');      
      res.view('uesr/user_message',{               
          user:req.session.user,                
        });
  },



  /**
   * get project main page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectMain: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectMain '+ req.params.pid);      
      res.view('project/project_main',{               
          user:req.session.user,
          pid: req.params.pid                
        });
  },

  /**
   * get project taskboard page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectTaskboard: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectTaskboard');
      DataService.getProjectById(req.params.pid, function(err, project){
        if(err) res.view('taskboard',{                
          user:req.session.user,
          project:{ _id: req.params.pid, cSprint: 0 }
        });
        else res.view('project/taskboard',{
          user: req.session.user,
          project:project
        });
      });      
      
  },

  /**
   * get project schedule page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectCal: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectCal');      
      res.view('project/project_cal',{                
          user:req.session.user,                
        });
  },

  /**
   * get project issue page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectIssue: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectIssue');      
      res.view('project/project_issue',{                
          user:req.session.user,                
        });
  },

  /**
   * get project files page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectFiles: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectFiles');      
      res.view('project/project_files',{                
          user:req.session.user,                
        });
  },

   /**
   * get project topic page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectTopic: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectTopic');      
      res.view('project/project_topic',{                
          user:req.session.user,                
        });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StaticController)
   */
  _config: {}

  
};
