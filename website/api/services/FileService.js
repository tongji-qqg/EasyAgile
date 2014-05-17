
var projectModel = require('../schemas/projectSchema');
var userModel = require('../schemas/userSchema');
var _  = require('underscore');
var async = require('async');
var fs   = require('fs');
var mkdirp = require('mkdirp');
exports.getFileListOfProject = function(pid, callback){

	async.waterfall([
		function(callback){
			DataService.getProjectById(pid, callback);
		},
		function(project, callback){
			userModel.populate(project.files,{path:'owner', select:'_id name icon'},function(err){
				if(err) callback(ErrorService.makeDbErr(err));
				else callback(null, project.files);
			})
		}
	],callback)
};

exports.uploadFileToProject = function(selfuid, pid, file, callback){
	var path= "files/"+pid;	

	async.waterfall([
		function(callback){
			fs.exists(path, function(exists) {
    			if (!exists) {
        			mkdirp(path, function(err){
	                    	if(err) callback(err);
	                    	else callback(null);
	                });  
    			} 
    			else
    				callback(null);
			});
		},

		function(callback){
			sails.log.verbose('save file'+file);		
			path += '/'+file.name;
	      	fs.readFile(file.path, function (err, data) {
		      if (err) {
		        callback(ErrorService.makeDbErr(err));
		      } else {
		        fs.writeFile(path, data, function (err) {
		          if (err) callback(ErrorService.makeDbErr(err));
		          else callback(null);
		        })
		      }
		    });
		},

		function(callback){
		
			DataService.getProjectById(pid, callback);
		},
		function(project,callback){
			project.files.push({
				name:file.name,
				path:path,
				size:file.size,
				owner:selfuid
			});
			project.save(callback);
		}
	],callback)
} 

exports.uploadFilesToProject = function(selfuid, pid, files, callback){
	var dirpath= "files/"+pid;	

	async.waterfall([
		function(callback){
			fs.exists(dirpath, function(exists) {
    			if (!exists) {
        			mkdirp(dirpath, function(err){
	                    	if(err) callback(err);
	                    	else callback(null);
	                });  
    			} 
    			else
    				callback(null);
			});
		},

		function(callback){
		
			DataService.getProjectById(pid, callback);
		},

		function(project, callback){
			sails.log.verbose('save files');		
			
	      	async.forEach(files,function(file,cb) {
	            var path = "files/"+pid+'/'+file.name;
		      	fs.readFile(file.path, function (err, data) {
			      if (err) {
			        cb(ErrorService.makeDbErr(err));
			      } else {
			        fs.writeFile(path, data, function (err) {
			          if (err) cb(ErrorService.makeDbErr(err));
			          else{
			          	project.files.push({
			          		name:file.name,
							path:path,
							size:file.size,
							owner:selfuid
			          	})
			          	cb(null);
			          }
			        })
			      }
			    });
	        },
	        // And respond
	        function(err) {
	        	if(err) callback(err);
	            else callback(null,project);
	        });
		},
		
		function(project,callback){

			project.save(callback);
		}
	],callback)
} 

exports.downloadFileFromProject = function(pid, fid, callback){

	DataService.getProjectById(pid, function(err,project){
		if(err) return callback(err);
		file = project.files.id(fid);
		if(!file) return callback(ErrorService.fileNotFindError);
		callback(null, file);
	});
}

exports.deleteFileOfProject = function(pid, fid, callback){

	async.waterfall([
		function(callback){
			DataService.getProjectById(pid, function(err,project){
				if(err) return callback(err);
				project.files.remove(fid);				
				callback(null, project);
			});	
		},
		function(project, callback){
			project.save(function(err){
				if(err) return callback(ErrorService.makeDbErr(err));
				else callback(null);
			});
		}
			
	],callback);
	
}

exports.setUserIcon = function(selfuid, icon, callback){
	var path = 'public/icon';

	async.waterfall([
		function(callback){
			fs.exists(path, function(exists) {
    			if (!exists) {
        			mkdirp(path, function(err){
	                    	if(err) callback(err);
	                    	else callback(null);
	                });  
    			} 
    			else
    				callback(null);
			});
		},

		function(callback){
			sails.log.verbose('save file'+file);		
			path += '/' + selfuid +_.str.fileExtension(file.name),
	      	fs.readFile(file.path, function (err, data) {
		      if (err) {
		        callback(ErrorService.makeDbErr(err));
		      } else {
		        fs.writeFile(path, data, function (err) {
		          if (err) callback(ErrorService.makeDbErr(err));
		          else callback(null);
		        })
		      }
		    });
		},
		
		function(callback){
			DataService.getUserById(selfuid, function(err, user){
				if(err)return  callback(err);
				user.icon = path;
				user.save(function(err, result){
					if(err) callback(ErrorService.makeDbErr(err));
					else callback(null, DataService.makeUserInfo(result));
				})
			})
		}
	],callback);
}