/**
 * TopicController
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
	 * get    /API/p/:pid/t 
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getAllTopics: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TopicController.getAllTopics');
	    topicService.getTopicListOfProject(req.session.user._id, req.params.pid,function(err, topics){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('topics', topics));
		});
    },
  
    /**
	 * get    /API/p/:pid/t/:tid 
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getOneTopic: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TopicController.getOneTopic');
	    topicService.getTopic(req.session.user._id, req.params.pid, req.params.tid, false,function(err, topic){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('topic', topic));
		});
    },

    /**
	 * post   /API/p/:pid/t    
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    createTopic: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TopicController.createTopic');
	    topicService.postTopic(req.session.user._id, req.params.pid, {
			title: req.body.title,
			body: req.body.body
		},req.body.at, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});
    },

    /**
	 * delete /API/p/:pid/t/:tid 
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteTopic: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TopicController.deleteTopic');
	    topicService.deleteTopic(req.session.user._id, req.params.pid, req.params.tid, function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});		
    },

    /**
	 * post   /API/p/:pid/tc/:tid 
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    commentTopic: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TopicController.commentTopic');
	    topicService.commentTopic(req.session.user._id, req.params.pid, req.params.tid, req.body.comment,
			function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});		
    },

    /**
	 * get    /API/p/:pid/tc/:tid  
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getComments: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TopicController.getComments');
	    topicService.getTopic(req.session.user._id, req.params.pid, req.params.tid, true,function(err, comments){
			if(err) res.json(err);
			else res.json(ErrorService.successWithValue('comments', comments));
		});
    },

    /**
	 * delete /API/p/:pid/t/:tid/c/:cid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteComment: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/TopicController.deleteComment');
	    topicService.deleteCommentOfTopic(req.session.user._id, req.params.pid, req.params.tid, req.params.cid,
			function(err){
			if(err) res.json(err);
			else res.json(ErrorService.success);
		});	
    },
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TopicController)
   */
  _config: {}

  
};
