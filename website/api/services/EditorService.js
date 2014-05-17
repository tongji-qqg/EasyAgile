
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');


exports.get = function(pid, callback){

	DataService.getProjectById(pid, function(err, project){
		if(err) callback(err);
		else callback(null, project.editor);
	});
};

exports.create = function(pid, info, callback){

	async.waterfall([
		function(callback){
			DataService.getProjectById(pid,callback);
		},
		function(project,callback){
			project.editor.push(info);
			project.save(function(err,p){
				if(err) callback(ErrorService.makeDbErr(err));
				else callback(null, p);
			});
		}
	],callback);
}

exports.edit = function(pid, eid, callback){}

exports.delete = function(pid, eid, callback){}