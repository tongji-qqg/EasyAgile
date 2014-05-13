
exports.updateSprint = function(req, res){

	sails.io.sockets.in('sprintId_'+req.params.sid).emit('sprint', {sid: req.params.sid});
}

exports.updateProject = function(req, res){

	sails.io.sockets.in('projectId_'+req.params.sid).emit('project', {pid: req.params.pid});
}