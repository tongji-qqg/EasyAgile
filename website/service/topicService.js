var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var topicModel = require('../schemas/topicSchema');
var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var async = require('async');

var databaseError = {
		message: 'database error!'
	},
	projectNotFindError = {
		message: 'peoject not find!'
	},
	userNotFindError = {
		message: 'user not find!'
	},
	memberNotFindError = {
		message: 'member not find!'
	},
	requirementNotFindError = {
		message: 'requirement not find!'
	},
	topicNotFindError = {
		message: 'topic not find!'
	},
	commentNotFindError = {
		message: 'comment not find!'
	},
	alreadyOwnerError = {
		message: 'you are already project owner!'
	},
	alreadyMemberError = {
		message: 'alreay team member!'
	},
	cannotRemoveOwnerError = {
		message: 'project owner can not remove'
	},
	notAdminError = {
		message: 'no do not have admin permission '
	};


Array.prototype.removeByPos = function(from, to) {
	console.log('here');
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


function findProject(pid, callback){
	projectModel.findById(pid, function(err, result){
				if(err) return callback(databaseError);
				if(result == null) callback(projectNotFindError);
				else callback(null,result);				
			});
}

function checkAdmin(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner._id.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null && member.isAdmin)
		permissin = true;
	
	if( !permission )return callback(notAdminError);	    	
	callback(null, targetProject);
}

function checkMember(selfuid, targetProject,callback){
	var permission = false;

	if(targetProject.owner._id.equals(selfuid))
		permission = true;	    	

	var member = targetProject.members.id(selfuid);	    	
	if(member != null)
		permissin = true;
	
	if( !permission )return callback(notAdminError);	    	
	callback(null, targetProject);
}

exports.postTopic = function(selfuid, pid, topic, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var topic = new topicModel({
	    		author: selfuid,
	    		title: topic.title,
	    		body:  topic.body
	    	});
	    	topic.save(function(err){
	    		if(err) callback(err);
	    		else callback(null, targetProject, topic);
	    	});
	    },

	    function(targetProject, newTopic, callback){	   
	    	
	    	targetProject.topics.push(newTopic._id);

	    	targetProject.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }	

	], cb);

};

exports.getTopic = function(selfuid, pid, tid, bIsComments, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = targetProject.topics.indexOf(tid);
	    	if(pos == -1) return callback(topicNotFindError);

	    	topicModel.findOne({'_id': tid})
	    			 .populate('author','_id name icon')	    			 
	    			 .exec(function(err, topic){
	    			 	if(err) callback(err);
	    			 	else callback(null, topic); 
	    			 });	    	
	    },

	    function(topic, callback){	    	
			
			var commentList = [];
			var queries = [];
			var makeQuery = function(comment){
				return function(callback){
					userModel.findById(comment.owner)								  
								  .select('_id name icon')								  
								  .exec(function(err, user){						  	
								  	if(err)
								  		return callback(err);
								  	
							  		if(user)
							  		{							  			
							  			var c = {
							  				comment: comment,
							  				user: user
							  			};
						  				commentList.push(c);								  			
						  			}
						  			callback();							  		
								  });					
				}
			}; 
			
			topic.comments.forEach( function(c){
				queries.push(makeQuery(c));
			});
			
			async.parallel(queries,function(err){
				
				if(err) return callback(err);
				
				if(bIsComments)
					callback(null, commentList);
				else{					
					callback(null, topic);
				}
			});					
	    }	   

	], cb);

};

exports.deleteTopic = function(selfuid, pid, tid, cb){

		async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkAdmin(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {

	    	var pos = targetProject.topics.indexOf(tid);
	    	if(pos == -1) return callback(topicNotFindError);

	    	topicModel.findOne({'_id': tid},function(err,topic){
	    		if(err) return callback(databaseError);
	    		if(!topic) return callback(topicNotFindError);
	    		topic.deleted = true;
	    		topic.save(function(err){
	    			if(err) return callback(err);
	    		});
	    	});	    		    	
	
	    	callback(null)
	    }
	   
	], cb);
};

exports.getTopicListOfProject = function(selfuid, pid, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback) {
			
			var topicList = [];
			var queries = [];
			var makeQuery = function(tid){
				return function(callback){
					topicModel.findOne({'_id': tid})
								  .populate('author','_id name icon')
								  .select('title author date deleted')
								  .where('deleted == false')
								  .exec(function(err, topic){						  	
								  	if(err)
								  		return callback(err);
								  	
							  		if(topic && topic.deleted == false)
						  				topicList.push(topic);							  		
						  			callback();							  		
								  });					
				}
			}; 
			
			targetProject.topics.forEach( function(id){
				queries.push(makeQuery(id));
			});
			
			async.parallel(queries,function(err){
				
				if(err) callback(err);
				else callback(null,topicList);
			});					 				
		    			     	
	    }

	], cb);

};

exports.commentTopic = function(selfuid, pid, tid, comment, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){
	    	topicModel.findById(tid, function(err, topic){
	    		if(err) return callback(topicNotFindError);
	    		callback(null,topic);
	    	});
	    },

	    function(topic, callback) {

	    	var c = {
	    		owner: selfuid,
	    		body: comment,	    		
	    	};
	    	topic.comments.push(c);

	    	topic.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }
	    

	], cb);

};

exports.deleteCommentOfTopic = function(selfuid, pid, tid, cid, cb){

	async.waterfall([

	    function(callback){

			findProject(pid, callback);       
	    },

	    function(targetProject, callback){	   

	    	checkMember(selfuid, targetProject,callback);
	    },	

	    function(targetProject, callback){
	    	topicModel.findById(tid, function(err, topic){
	    		if(err) return callback(topicNotFindError);
	    		callback(null,topic);
	    	});
	    },

	    function(topic, callback) {

	    	var comment = topic.comments.id(cid);

	    	if(comment == null) return callback(commentNotFindError);
	    	comment.remove();

	    	console.log(topic);
	    	topic.save(function(err){
	    		if(err) callback(err);
	    		else callback(null);
	    	});
	    }
	    

	], cb);

};