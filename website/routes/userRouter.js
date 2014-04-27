var F = require('./functions');

var userService = require('../service/userService');
////////////////////////////////////////////////////////////////////////////////////////
//
//            data define just fot development
//
////////////////////////////////////////////////////////////////////////////////////////

var messageList = [
	{id:1, message:"hello world!",read:false},
	{id:2, message:"hello tongji!",read:false}
];

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
	 * browser interact with server	 	
	 *
	 */
	//////////////register
	app.post('/reg', function(req,res){
		console.log('request post: /reg');
		var newUser = {
			name  : req.body.name,
			email : req.body.email,
			password: req.body.password
		};
		userService.register(newUser, function(err){
				if(err){
					console.log('register err '+ err.message);					
					res.json(error);					
				}
				else{
					console.log('register successs!');
					req.session.user = newUser; //用户信息存入session
					req.session.save();

					var r = {
						state : 'success',
						user  : newUser
					};
		   			res.header('Access-Control-Allow-Credentials', 'true');		   			
		   			res.json(r);
				}
			});		   
	});

	//////////////login
	app.post('/login', F.checkNotLogin);
	app.post('/login', function(req, res){
		 console.log('request post: /login');

		 userService.loginByEmail(req.body.emailaddress, req.body.password,function(err,result){
		 	if(err){
		 		console.log(err);
		 		res.redirect('/login');
		 	}
		 	else{
		 		console.log(result);
		 		req.session.user = result;
		 		res.redirect('/user/'+result._id);
		 	}
		 });
		 
	});

	/*********************************************************
	 *
	 * user APIs	
	 *
	 */
	/////////////////////get user name like :name, return a list(array) of user info, may be null array([])
	app.get('/API/u/name/:name',function(req,res){
		console.log('request get: API/u/nameLike/:name, name = '+ req.params.name);
		res.json(userList);
	});

	//////////////////////get a email corresponding user info, may be null({})
	app.get('/API/u/email/:email',function(req,res){
		console.log('request get: API/u/nameLike/:email, email = '+ req.params.email);

		userService.findUserByEmail(req.params.email, function(err, result){
			if(err)
				res.json(err);
			else
				res.json(result);
		});

	});

	/////////////////////get one user info by id
	app.get('/API/u/:uid', F.checkUser);
	app.get('/API/u/:uid', function(req,res){
		console.log('request get: /API/u/:uid, uid = '+ req.params.uid);

		userService.findUserById(req.params.uid, function(err,result){
			if(err) res.json(err);
			else res.json(result);
		});

	});

	/////////////////////for android validate user
	app.post('/API/u',function(req,res){
		console.log('request post: /API/u');

		userService.loginByEmail(req.body.emailaddress, req.body.password,function(err,result){
			if(err) res.json(err);
			else{
				req.session.user = result;
				var r = {
					state:'success',
					user: result
				};
				res.json(r);
			}
		});
		
	});

	/////////////////////change user information: name, icon, phone, birthady
	app.put('/API/u/:uid',F.checkUser);
	app.put('/API/u/:uid',function(req,res){
		console.log('request put: /API/u/:uid, uid = '+ req.params.uid);

		var targetUser = {					
		};
		if(req.body.name)targetUser.name = req.body.name;
		if(req.body.icon)targetUser.icon = req.body.icon;
		if(req.body.phone)targetUser.phone = req.body.phone;
		if(req.body.birthday)targetUser.birthday = req.body.birthday;

		if(targetUser === {}) return res.json(success);
		userService.updateUserInfo(req.params.uid, targetUser, function(err){
			if(err) res.json(err);
			else res.json(success);
		});

	});

	/////////////////////change user password
	app.put('/API/u/pw/:uid',F.checkUser);
	app.put('/API/u/pw/:uid',function(req,res){
		console.log('request put: /API/u/pw/:uid, uid = '+ req.params.uid);

		if(req.body.password == null)
			return res.json(err);
		userService.updateUserInfo(req.params.uid, { password: req.body.password }, function(err){
			if(err) res.json(err);
			else res.json(success);
		});		
		res.json(success);


	});

	/////////////////////get user tasks
	app.get('/API/u/:uid/tasks',F.checkUser);
	app.get('/API/u/:uid/tasks',function(req,res){
		console.log('request get: /API/u/:uid/tasks, uid = '+ req.params.uid);
		res.json(sprint.tasks);
	});

	/*********************************************************
	 *
	 * for user message
	 *
	 */
	////////////////////get all unread user messages
	app.get('/API/u/:uid/m',F.checkUser);
	app.get('/API/u/:uid/m',function(req,res){
		console.log('request get: /API/u/:uid/m, uid = '+ req.params.uid);
		res.json(messageList);
	});

	////////////////////set a message to read
	app.put('/API/u/:uid/m/:mid',F.checkUser);
	app.put('/API/u/:uid/m/:mid',function(req,res){
		console.log('request put: /API/u/:uid/m/:mid, uid = '+ req.params.uid + ' mid = '+ req.params.mid);
		res.json(success);
	});
}