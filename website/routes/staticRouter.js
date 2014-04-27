/*********************************************************
 *
 *  get static html file
 *  /, /reg, /login, /logout, /user/:uid, /project/:pid
 *
 */
//////////////index html

var F = require('./functions');

var projectService = require('../service/projectService');

module.exports = function(app) {
	//////////////index html
	app.get('/', function (req,res) {
		console.log("request get: /");
		res.render('index', {
			title:'主页',
			user:req.session.user
		});
	});

	//////////////register html
	app.get('/reg', F.checkNotLogin);
	app.get('/reg', function(req,res){
		console.log('request get: /reg');		
		res.render('signup',{
			title:'注册',
			user:req.session.user
		});
	});

	//////////////login html
	app.get('/login', F.checkNotLogin);
	app.get('/login', function(req,res){
		console.log('request get: /login');
		res.render('login',{
			title: '登录',
			user: req.session.user
		});
	});

	//////////////logout	
    app.get('/logout',F.checkLogin);
	app.get('/logout', function (req,res) {
		console.log('request get: /logout');
		req.session.user = null;
		res.redirect('/');
	});

	//////////////user html
    app.get('/user/:uid', F.checkLogin);
    app.get('/user/:uid', F.checkUser);
	app.get('/user/:uid', function (req,res) {
		console.log('request get: /user/:uid, uid = '+ req.params.uid);
		res.render('user',{
			title:'用户中心',
			user:req.session.user
		});
	});

	//////////////project html
    app.get('/project/:pid', F.checkLogin);
    app.get('/project/:pid', F.checkProjectMember);
	app.get('/project/:pid', function (req,res) {
		console.log('request get: /project/:pid, pid = '+ req.params.pid);

		projectService.findProjectInfoById(req.params.pid, function(err,project){
			if(err) res.json(err);
			else res.render('project',{
								title:"项目",
								user:req.session.user,
								project: project
							});
		});
		
	});
}