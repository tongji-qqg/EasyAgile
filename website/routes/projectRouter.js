

////////////////////////////////////////////////////////////////////////////////////////
//
//            data define
//
////////////////////////////////////////////////////////////////////////////////////////

var F = require('./functions');

var projectService = require('../service/projectService');

var success = require('../service/errorDefine').success;

////////////////////////////////////////////////////////////////////////////////////////
//
//            router
//
////////////////////////////////////////////////////////////////////////////////////////


module.exports = function(app){


	/*********************************************************
	 *
	 * project basic APIs	
	 *
	 */
	////////////////////new a proect, post basic project info
	app.post('/API/p',F.checkUser);
	app.post('/API/p',function(req,res){
		console.log('request post: /API/p');

		projectService.createProject(req.session.user._id, req.body.name, req.body.des, function(err){
			if(err) res.json(err);
			else res.json(success);	
		});
		
	});

	////////////////////get a project basic info
	app.get('/API/p/:pid',F.checkUser);
	app.get('/API/p/:pid',function(req,res){
		console.log('request get: /API/p/:pid, pid = '+ req.params.pid);

		projectService.findProjectInfoById(req.session.user._id, req.params.pid, function(err,result){
			
			if(err) res.json(err);
			else res.json(F.successWithValue('project', result));
		});

	});

	////////////////////modify a proect basic info
	app.put('/API/p/:pid',F.checkUser);
	app.put('/API/p/:pid',function(req,res){
		console.log('request put: /API/p/:pid, pid = '+ req.params.pid);

		var toProject = {};
		if(req.body.name) toProject.name = req.body.name;
		if(req.body.des)  toProject.description = req.body.des;
		if(req.body.endTime) toProject.endTime = req.body.endTime;
		if(toProject === {}) res.json(success);

		projectService.updateProjectInfo(req.session.user._id, req.params.pid, toProject, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////finish a project	
	app.put('/API/pf/:pid',F.checkUser);
	app.put('/API/pf/:pid',function(req,res){
		console.log('request put: /API/pf/:pid, pid = '+ req.params.pid);

		projectService.finishProject(req.session.user._id, req.params.pid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////invite a team member by user id
	app.post('/API/p/:pid/mid/:uid',F.checkUser);	
	app.post('/API/p/:pid/mid/:uid',function(req,res){
		console.log('request post: /API/p/:pid/m/:uid, pid = '+ req.params.pid+' uid = '+req.params.uid);

		projectService.addMemberById(req.session.user._id, req.params.pid, req.params.uid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

 	////////////////////invite a team member by Email
	 app.post('/API/p/:pid/me/:email',F.checkUser);	 
	 app.post('/API/p/:pid/me/:email',function(req,res){
	 	console.log('request post: /API/p/:pid/me/:email, pid = '+ 
	 		req.params.pid+ ' email = '+ req.params.email);
	 	res.json(success);
	 });

	////////////////////delete a team member by user id
	app.delete('/API/p/:pid/mid/:uid',F.checkUser);	
	app.delete('/API/p/:pid/mid/:uid',function(req,res){
		console.log('request delete: /API/p/:pid/m/:uid, pid = '+ req.params.pid+' uid = '+req.params.uid);

		projectService.removeMemberById(req.session.user._id, req.params.pid, req.params.uid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////set a team member as Admin
	 app.put('/API/p/:pid/ma/:uid',F.checkUser);	 
	 app.put('/API/p/:pid/ma/:uid',function(req,res){
	 	console.log('request put: /API/p/:pid/ma/:uid, pid = '+ 
	 		req.params.pid+ ' uid = '+ req.params.uid);

	 	projectService.setAdmin(req.session.user._id, req.params.pid, req.params.uid, true, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
	 	
	 });

	////////////////////remove admin of a team member
	 app.delete('/API/p/:pid/ma/:uid',F.checkUser);	
	 app.delete('/API/p/:pid/ma/:uid',function(req,res){
	 	console.log('request delete: /API/p/:pid/ma/:uid, pid = '+ 
	 		req.params.pid+ ' uid = '+ req.params.uid);
	 	
	 	projectService.setAdmin(req.session.user._id, req.params.pid, req.params.uid, false, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	 });

	////////////////////if user is admin of a project
	app.get('/API/p/:pid/u/:uid/admin',F.checkUser);	
	app.get('/API/p/:pid/u/:uid/admin',function(req,res){
		console.log('request get: /API/p/:pid/u/:uid/admin, pid = '+ req.params.pid+' uid = '+req.params.uid);

		projectService.addMemberById(req.session.user._id, req.params.pid, req.params.uid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});
};