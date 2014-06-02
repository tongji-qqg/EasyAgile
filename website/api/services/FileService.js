
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
	if(!file) return callback(ErrorService.fileNotFindError);
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
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({						
				type: HistoryService.PROJECT_TYPE.file_upload,
				who : selfuid,
				what: [file.name]
			});
			project.save(callback);
		}
	],callback)
} 

exports.uploadFilesToProject = function(selfuid, pid, files, callback){
	if(!files || files==[]) return callback(ErrorService.fileNotFindError);
	var dirpath= "files/"+pid;	
	var filenameArr = [];
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
	            filenameArr.push(file.name);
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
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({						
				type: HistoryService.PROJECT_TYPE.file_upload,
				who : selfuid,
				what: filenameArr
			});
			project.save(callback);
		}
	],callback)
} 

exports.downloadFileFromProject = function(selfuid, pid, fid, callback){

	DataService.getProjectById(pid, function(err,project){
		if(err) return callback(err);
		file = project.files.id(fid);
		if(!file) return callback(ErrorService.fileNotFindError);
		/////////////////////////////////////
		//   project history
		/////////////////////////////////////
		project.history.push({						
			type: HistoryService.PROJECT_TYPE.file_download,
			who : selfuid,
			what: [file.name]
		});
		project.save(function(err){})
		callback(null, file);
		MessageService.sendUserMessage(selfuid, file.owner, 
			MessageService.TYPE.download_file, '下载了你的文件'+file.name, function(){});
	});
}

exports.deleteFileOfProject = function(selfuid, pid, fid, callback){

	async.waterfall([
		function(callback){
			DataService.getProjectById(pid, function(err,project){
				if(err) return callback(err);
				var file = project.files.id(fid);
				//project.files.remove(fid);				
				callback(null, project, file);
			});	
		},
		function(project, file, callback){
			if(!file)return callback(ErrorService.fileNotFindError);
			/////////////////////////////////////
			//   project history
			/////////////////////////////////////
			project.history.push({						
				type: HistoryService.PROJECT_TYPE.file_delete,
				who : selfuid,
				what: [file.name]
			});
			file.remove();
			project.save(function(err){
				if(err) return callback(ErrorService.makeDbErr(err));
				else callback(null);
			});
		}
			
	],callback);
	
}

exports.setUserIcon = function(selfuid, icon, callback){
	var path = 'public/usericons';
	if(!icon) return callback(ErrorService.missInfoError);
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
			sails.log.verbose('save file'+icon);		
			path += '/' + selfuid + '.' +icon.name.split('.').pop()
	      	fs.readFile(icon.path, function (err, data) {
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
				user.icon = 'usericons/'+selfuid+'.'+icon.name.split('.').pop();
				user.iconid = user.iconid || 0;
				user.iconid++;
				user.save(function(err, result){
					if(err) callback(ErrorService.makeDbErr(err));
					else callback(null, DataService.makeUserInfo(result));
				})
			})
		}
	],callback);
}