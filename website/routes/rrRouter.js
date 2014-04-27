
var F = require('./functions');

var rrService = require('../service/rrService');


////////////////////////////////////////////////////////////////////////////////////////
//
//            data define just fot development
//
////////////////////////////////////////////////////////////////////////////////////////

var success = {
	state: "success",
	errorNUmber: 0,   //always 0	
};

var error = {
	state: "error",
	errorNumber: 1,    //may be other numbers
	message: "error message"
};




module.exports = function(app){


	/*********************************************************
	 *
	 * project requirements basic APIs	
	 *
	 */
	////////////////////get require list of a project
	app.get('/API/p/:pid/r',F.checkUser);
	app.get('/API/p/:pid/r',function(req,res){
		console.log('request get: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.getAllRequirements(req.session.user._id, req.params.pid, function(err,result){
			if(err) res.json(err);
			else res.json(result);
		});

	});

	////////////////////delete all requirements of a project
	app.delete('/API/p/:pid/r',F.checkUser);
	app.delete('/API/p/:pid/r',function(req,res){
		console.log('request delete: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.deleteAllRequirements(req.session.user._id, req.params.pid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////add a requirement of a project
	app.post('/API/p/:pid/r',F.checkUser);
	app.post('/API/p/:pid/r',function(req,res){
		console.log('request post: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.addaRequirement(req.session.user._id, req.params.pid, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////bulk update
	app.put('/API/p/:pid/r',F.checkUser);
	app.put('/API/p/:pid/r',function(req,res){
		console.log('request put: /API/p/:pid/r, pid = '+ req.params.pid);

		rrService.setRequirements(req.session.user._id, req.params.pid, req.body.requirements, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

	////////////////////modify a requirement of a project
	app.put('/API/p/:pid/r/:rid',F.checkUser);
	app.put('/API/p/:pid/r/:rid',function(req,res){
		console.log('request put: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);
		
		rrService.modifyRequirementById(req.session.user._id, req.params.pid, req.params.rid, {
			description: req.body.description, 
			level: req.body.level
		},function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	////////////////////delete a requirement of a project
	app.delete('/API/p/:pid/r/:rid',F.checkUser);
	app.delete('/API/p/:pid/r/:rid',function(req,res){
		console.log('request delete: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);

		rrService.deleteRequirementById(req.session.user._id, req.params.pid, req.params.rid, function(err){
			if(err) res.json(err);
			else res.json(success);
		});
		
	});

};