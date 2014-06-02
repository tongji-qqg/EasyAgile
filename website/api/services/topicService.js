var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var topicModel = require('../schemas/topicSchema');


var async = require('async');


exports.postTopic = function(selfuid, pid, topicInfo, at, cb){

	async.waterfall([

	    function(callback){

			DataService.getProjectById(pid, callback);       
	    },	    

	    function(targetProject, callback) {

	    	var topic = new topicModel({
	    		author: selfuid,
	    		title: topicInfo.title,
	    		body:  topicInfo.body
	    	});
	    	topic.save(function(err){
	    		if(err) callback(ErrorService.makeDbErr(err));
	    		else callback(null, targetProject, topic);
	    	});
	    },

	    function(targetProject, newTopic, callback){	   
	    	
	    	targetProject.topics.push(newTopic._id);
	    	/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			targetProject.history.push({
				type: HistoryService.PROJECT_TYPE.topic_new,
				who : selfuid,
				what:[newTopic.title]
			});
	    	targetProject.save(function(err){
	    		if(err) callback(ErrorService.makeDbErr(err));
	    		else callback(null);
	    	});
	    	if(at){
	    		for(var i=0;i<at.length;i++){
	    			if(at[i] == selfuid) continue;
	    			MessageService.sendUserMessage(selfuid, at[i], 
						MessageService.TYPE.publish_topic, '在讨论<'+newTopic.title+'>中@了你', function(){});
	    		}
	    	}
	    }	

	], cb);

};

exports.getTopic = function(selfuid, pid, tid, bIsComments, cb){

	async.waterfall([

	    function(callback){

			DataService.getProjectById(pid, callback);        
	    },

	    function(targetProject, callback) {

	    	var pos = targetProject.topics.indexOf(tid);
	    	if(pos == -1) return callback(ErrorService.topicNotFindError);

	    	topicModel.findOne({'_id': tid})
	    			 .populate('author','_id name icon iconid')	    			 
	    			 .exec(function(err, topic){
	    			 	if(err) return callback(ErrorService.makeDbErr(err));
	    			 	if(topic == null) return callback(ErrorService.topicNotFindError); 
	    			 	userModel.populate(topic.comments,
	    			 		               {path:'owner', select:'_id name icon iconid'},
	    			 		               function(err){
	    			 		                	if(err) return callback(ErrorService.makeDbErr(err));
	    			 		                	if(bIsComments) callback(null, topic.comments);
	    			 		                	else callback(null,topic);
	    			 		               });
	    			 });	    	
	    }	    

	], cb);

};

exports.deleteTopic = function(selfuid, pid, tid, cb){

		async.waterfall([

	    function(callback){

			DataService.getProjectById(pid, callback); 
	    },

	    function(targetProject, callback) {

	    	var pos = targetProject.topics.indexOf(tid);
	    	if(pos == -1) return callback(ErrorService.topicNotFindError);

	    	topicModel.findOne({'_id': tid},function(err,topic){
	    		if(err) return callback(ErrorService.databaseError);
	    		if(!topic) return callback(ErrorService.topicNotFindError);
	    		topic.deleted = true;
	    		topic.save(function(err){
	    			if(err) callback(ErrorService.makeDbErr(err));
	    			else callback(null, targetProject, topic);
	    		});
	    	});	    		    			    
	    },
	    function(project, topic, callback){
	    	project.topics.remove(tid);
	    	/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({
				type: HistoryService.PROJECT_TYPE.topic_delete,
				who : selfuid,
				what:[topic.title]
			});
	    	project.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }
	   
	], cb);
};

exports.getTopicListOfProject = function(selfuid, pid, cb){

	async.waterfall([

	    function(callback){

			DataService.getProjectTopicsById(pid, callback);       
	    },

	    function(project, callback) {
			
		 	topicModel.populate(project.topics,
	           {path:'author', select:'_id name icon iconid'},
	           function(err){	           	
	            	if(err) return callback(ErrorService.makeDbErr(err));	            	
	            	else callback(null,project.topics);
	           });	    				    			     	
	    }	    

	], cb);

};

exports.commentTopic = function(selfuid, pid, tid, comment, cb){

	async.waterfall([

	    function(callback){

			DataService.getProjectById(pid, callback);   
	    },

	    function(targetProject, callback){
	    	
	    	if(DataService.isTopicInProject(targetProject,tid))
	    		DataService.getTopicById(tid, callback);   	
	    	else callback(ErrorService.topicNotFindError);
		},

	    function(topic, callback) {

	    	var c = {
	    		owner: selfuid,
	    		body: comment,	    		
	    	};
	    	topic.comments.push(c);

	    	topic.save(function(err){
	    		if(err) callback(ErrorService.makeDbErr(err));
	    		else callback(null);
	    	});
	    }
	    

	], cb);

};

exports.deleteCommentOfTopic = function(selfuid, pid, tid, cid, cb){

	async.waterfall([

	    function(callback){

			DataService.getProjectById(pid, callback);      
	    },

	    function(targetProject, callback){
	    	if(DataService.isTopicInProject(targetProject,tid))
	    		DataService.getTopicById(tid, callback);   	
	    	else callback(ErrorService.topicNotFindError);
	    },

	    function(topic, callback) {

	    	var comment = topic.comments.id(cid);

	    	if(comment == null) return callback(ErrorService.commentNotFindError);
	    	comment.remove();
	    	
	    	topic.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }
	    

	], cb);

};