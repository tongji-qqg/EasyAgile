
exports.updateSprint = function(req, res){

	sails.io.sockets.in('sprintId_'+req.params.sid).emit('sprint', {sid: req.params.sid, uid:req.session.user._id});
}

exports.deleteSprint = function(req, res){

	sails.io.sockets.in('sprintId_'+req.params.sid).emit('sprintDelete', {sid: req.params.sid, uid:req.session.user._id});
}

exports.updateProject = function(req, res){

	sails.io.sockets.in('projectId_'+req.params.sid).emit('project', {pid: req.params.pid,  uid:req.session.user._id});
}

exports.alertUser = function(uid){
	sails.log.warn('uid');
	sails.io.sockets.in('userId_'+uid).emit('alert','receive an alert');
}