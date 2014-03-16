
/**
 * Page direct resolution
 */

var crypto = require('crypto'),
    User = require('../models/user.js');

module.exports = function(app) {

	app.get('/', function (req,res) {
		res.render('index',
		{	title: '主页',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});



	  app.get('/reg',checkNotLogin);
	  app.get('/reg',function(req,res){
		 res.render('reg',{title:'注册',
		 user: req.session.user,
		 success: req.flash('success').toString(),
		 error: req.flash('error').toString()
		 });
	 });

	 app.post('/reg',checkNotLogin);
	 app.post('/reg', function(req,res){
		 var name = req.body.username,
		   password = req.body.password,
		   password_re = req.body['password-repeat'];
		 if(name==''){
		     req.flash('error','用户名不能为空!'); 
		     return res.redirect('/reg');
		 }
		 //检验用户两次输入的密码是否一致
		 if(password_re != password){
			 req.flash('error','两次输入的密码不一致!'); 
			 return res.redirect('/reg');
		 }
		 //生成密码的散列值
		 var md5 = crypto.createHash('md5'),
		   password = md5.update(req.body.password).digest('hex');
		 var newUser = new User({
		   name: req.body.username,
		   password: password,
		   email: req.body.email
		 });
		 //检查用户名是否已经存在 
		 User.get(newUser.name, function(err, user){
		 if(user){
		   err = '用户已存在!';
		 }
		 if(err){
		   req.flash('error', err);
		   return res.redirect('/reg');
		 }
		 //如果不存在则新增用户
		 newUser.save(function(err){
		   if(err){
		     req.flash('error',err);
		     return res.redirect('/reg');
		   }
		   req.session.user = newUser;//用户信息存入session
		   req.flash('success','注册成功!');
		   res.redirect('/');
		 });
		});
	});
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{title:'登录',
          user: req.session.user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
		 });
	 });

  app.post('/login',checkNotLogin);
  app.post('/login', function(req, res){
	  //生成密码的散列值
	 var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
	 //检查用户是否存在
	User.get(req.body.username, function(err, user){
		 if(!user){
		   req.flash('error', '用户不存在!'); 
		   return res.redirect('/login'); 
		 }
		 //检查密码是否一致
		 if(user.password != password){
		   req.flash('error', '密码错误!'); 
		   return res.redirect('/login');
		 }
		 //用户名密码都匹配后，将用户信息存入 session
		 req.session.user = user;
		 req.flash('success','登陆成功!');
		 res.redirect('/');
	 });
	});

    app.get('/logout',checkLogin);
	app.get('/logout', function (req,res) {
		req.session.user = null;
		req.flash('success','登出成功!');
		res.redirect('/');
	});


	app.get('/home', function (req,res) {
		var user={
			username:'bryce',
			password:'whoami'
		}
		res.render('home', { title: 'Home',user: user});
	});


	app.use(function(req,res) {
		res.render("404");
	});
}

function checkLogin(req, res, next){
    if(!req.session.user){
	      req.flash('error','未登录!'); 
	      return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req,res,next){
    if(req.session.user){
	      req.flash('error','已登录!'); 
	      return res.redirect('/');
    }
    next();
}
