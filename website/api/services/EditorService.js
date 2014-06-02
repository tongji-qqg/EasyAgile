
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');
var BASEPATH = 'https://sizzling-fire-8846.firebaseio.com/';

exports.get = function(pid, callback){

	DataService.getProjectById(pid, function(err, project){
		if(err) callback(err);
		else {
			project.editor.forEach(function(e){
				e.path = BASEPATH + pid + '/'+ e._id;
			});
			callback(null, project.editor);
		}
	});
};

exports.create = function(selfuid, pid, info, callback){

	async.waterfall([
		function(callback){
			DataService.getProjectById(pid,callback);
		},
		function(project,callback){
			project.editor.push(info);
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({						
				type: HistoryService.PROJECT_TYPE.editor_new,
				who : selfuid,
				what: [info.name]
			});
			project.save(function(err,p){
				if(err) callback(ErrorService.makeDbErr(err));
				else callback(null, p);
			});
		}
	],callback);
}

exports.edit = function(pid, eid, callback){}

exports.delete = function(selfuid, pid, eid, callback){
	async.waterfall([
		function(callback){
			DataService.getProjectById(pid,callback);
		},
		function(project,callback){
			var editor = project.editor.id(eid);
			if(!editor) return callback(ErrorService.fileNotFindError);
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({						
				type: HistoryService.PROJECT_TYPE.editor_delete,
				who : selfuid,
				what: [editor.name]
			});
			project.editor.remove(eid);
			
			project.save(function(err,p){
				if(err) callback(ErrorService.makeDbErr(err));
				else callback(null, p.editor);
			});
		}
	],callback);
}