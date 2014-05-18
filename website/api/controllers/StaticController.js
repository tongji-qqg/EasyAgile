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
var async = require('async');
function renderViewWithProject(req, res, view){
  DataService.getProjectInfoById(req.params.pid, function(err, project){
        if(err) res.view(view,{                
          user:req.session.user,
          project:{ _id: req.params.pid, cSprint: 0 }
        });
        else res.view(view,{
          user: req.session.user,
          project:project
        });
      });  
}
function renderViewWithProjectAndTopics(req, res, view){
  async.waterfall([
    function(callback){
      DataService.getProjectInfoById(req.params.pid, callback)
    },
    function(project, callback){
      topicService.getTopicListOfProject(null, req.params.pid, function(err, topics){
        if(err) callback(err);
        else callback(null, project, topics);
      })
    }
  ],function(err,project,topics){
      if(err) res.json(err);
      else res.view(view,{
        user: req.session.user,
        project:project ,
        topics: topics
      })
  });
}
function renderViewWithProjectAndOneTopic(req, res, view){
  async.waterfall([
    function(callback){
      DataService.getProjectInfoById(req.params.pid, callback)
    },
    function(project, callback){
      topicService.getTopic(null, req.params.pid, req.params.tid, false, function(err, topic){
        if(err) callback(err);
        else callback(null, project, topic);
      })
    }
  ],function(err,project,topic){
      if(err) res.json(err);
      else res.view(view,{
        user: req.session.user,
        project:project ,
        topic: topic
      })
  });
}
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
      userService.getUserCurrentTaskInProject(req.session.user._id, function(err,lp, p,fp){
        if(err) return res.json(err);
        res.view('user/user_task',{               
          user:req.session.user,                
          'lp':lp,
          'p':p,
          'fp':fp
        })
      });
      //res.json({'lp':lp,'p':p,'fp':fp})
      //})
      /*res.view('user/user_task',{               
          user:req.session.user,                
        });*/
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
      res.view('user/user_message',{               
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
      
      renderViewWithProject(req, res, 'project/project_main');
  },

  /**
   * get project taskboard page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectTaskboard: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectTaskboard');
      
      renderViewWithProject(req, res, 'project/project_taskboard');
  },

  /**
   * get project schedule page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectCal: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectCal');      
      
      renderViewWithProject(req, res, 'project/project_cal');     
  },

  /**
   * get project issue page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectIssue: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectIssue'); 

      renderViewWithProject(req, res, 'project/project_issue');               
  },

  /**
   * get project files page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectFiles: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectFiles');      

      renderViewWithProject(req, res, 'project/project_files');           
  },

   /**
   * get project topic page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectTopic: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectTopic');      
      
      renderViewWithProjectAndTopics(req, res, 'project/project_topic');     
  },

  /**
   * get project topic page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectOneTopic: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectOneTopic');      
      
      renderViewWithProjectAndOneTopic(req, res, 'project/project_oneTopic');     
  },

  /**
   * get project editor page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectEditor: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectEditor');      
      
      renderViewWithProject(req, res, 'project/project_editor');     
  },
  /**
   * get project topic page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectNewTopic: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectTopic');      
      
      renderViewWithProjectAndTopics(req, res, 'project/project_newTopic');     
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StaticController)
   */
  _config: {}

  
};
