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


var async = require('async');
var _ = require('underscore');
function renderViewWithProject(req, res, view){
  DataService.getProjectInfoById(req.params.pid, function(err, project){
        // if(err) res.view(view,{                
        //   user:req.session.user,
        //   project:{ _id: req.params.pid, cSprint: 0 }
        // });
        if(err) res.render("404");
        else res.view(view,{
          user: req.session.user,
          project:project
        });
      });  
}
function renderViewWithProjectAndFiles(req, res, view){
  async.waterfall([
    function(callback){
      DataService.getProjectInfoById(req.params.pid, callback)
    },
    function(project, callback){
      FileService.getFileListOfProject( req.params.pid, function(err, files){
        if(err) callback(err);
        else callback(null, project, files);
      })
    }
  ],function(err,project,files){
      if(err) res.render("404");
      else res.view(view,{
        user: req.session.user,
        project:project ,
        files: files
      })
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
      if(err) res.render("404");
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
      if(err) res.render("404");
      else res.view(view,{
        user: req.session.user,
        project:project ,
        topic: topic
      })
  });
}
//var callid = 0;
function renderViewWithProjectAndTopicsFilesTasks(req, res, view){
  //var ca = callid++;
  //var time = process.hrtime();
  async.waterfall([
    function(callback){
      DataService.getProjectInfoById(req.params.pid, callback, true)
    },
    function(project, callback){
      topicService.getTopicListOfProject(null, req.params.pid, function(err, topics){
        //var diff = process.hrtime(time);
        //console.log(ca+ '. 1 took %d seconds and %d nanoseconds', diff[0], diff[1]);
        if(err) callback(err);
        else callback(null, project, topics);
      })
    },
    function(project, topics, callback){
      FileService.getFileListOfProject( req.params.pid, function(err, files){
        //var diff = process.hrtime(time);
        //console.log(ca+ '. 2 took %d seconds and %d nanoseconds', diff[0], diff[1]);
        if(err) callback(err);
        else callback(null, project, topics, files);
      })
    },
    function(project, topics, files, callback){
      taskService.getTasks(req.session.user._id, req.params.pid, project.cSprint, function(err, tasks){
        //var diff = process.hrtime(time);
        //console.log(ca+ '. 3 took %d seconds and %d nanoseconds', diff[0], diff[1]);
        if(err) res.json(err);
        else callback(null, project, topics, files, tasks);
      });
    }
  ],function(err,project,topics, files, tasks){      
           
      if(err) res.render("404");
      else res.view(view,{
        user: req.session.user,
        project:project ,
        issues: project.issues.reverse().slice(0,10),
        topics: topics.reverse().slice(0,10),
        files: files.reverse().slice(0,10),
        tasks: tasks.reverse().slice(0,10)
      })
      //var diff = process.hrtime(time);
      //console.log(ca+ '. 4 took %d seconds and %d nanoseconds', diff[0], diff[1]);
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
   * get /mobile
   * 
   * @param   {Request}   request     Request object
   * @param   {Response}  response    Response object
   */
  mobile: function (req, res) {
    
    sails.log.verbose('Controller - api/controller/StaticController.index');
    return res.view('mobile',{
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
      userService.getUserCurrentTaskInProject(req.session.user._id, function(err,p){
        if(err) return res.render("404");
        res.view('user/user_task',{               
          user:req.session.user,                          
          'p':p,
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
      
      renderViewWithProjectAndTopicsFilesTasks(req, res, 'project/project_main');
      
      //renderViewWithProjectAndTopicsFilesTasks(req, res, 'mobile');
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

      renderViewWithProjectAndFiles(req, res, 'project/project_files');           
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
      
      renderViewWithProject(req, res, 'project/project_editor_new');     
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
   * get project topic page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectMembers: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectMembers');      
      
      renderViewWithProjectAndTopics(req, res, 'project/project_members');     
  },

  /**
   * get project topic page action, this will just shows login screen if user isn't logged in yet.
   *
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
  projectHistory: function(req, res) {
      sails.log.verbose('Controller - api/controller/StaticController.projectHistory');      
      
      renderViewWithProject(req, res, 'project/project_history');     
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to StaticController)
   */
  _config: {}

  
};
