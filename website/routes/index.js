
/**
 * Page direct resolution
 */

////////////////////////////////////////////////////////////////////////////////////////
//
//            data define just fot development
//
////////////////////////////////////////////////////////////////////////////////////////
var user = {
	id:1,
	name:"avoid",
	password:"whoami",           //put it here just for dev
	icon:"img/login/logo.png"
};

var messageList = [
	{id:1, message:"hello world!",read:false},
	{id:2, message:"hello tongji!",read:false}
];

var topicList = [
	{id:1,title:"title~~",author:1,date:new Date},
	{id:2,title:"title!!",author:1,date:new Date}
];

var sprintList = [
	{id:1,startTime:new Date,endTime:new Date,realEndTime:new Date,done:true},
	{id:2,startTime:new Date,endTime:new Date,realEndTime:null,done:false},
];

var sprint = {
	id:2,
	startTime:new Date,
	endTime:new Date,
	realEndTime:null,
	done:false,
	backlog:[
		{id:1,des:"user login",level:1},
		{id:2,des:"user register",level:1},
		{id:3,des:"user logout",level:1},
	],
	defects:[
		{id:1,des:"user login fail in IE",level:1}
	],
	issues:[
		{id:1,des:"UI prototype not finish!!"}
	],
	tasks:[
		{
			id:1,des:"server side user login",level:1,deadline:new Date,done:false,progress:20,
			executer:[{id:1,name:'avoid'}]
		},
		{
			id:2,des:"front side html user login",level:1,deadline:new Date,done:false,progress:90,
			executer:[{id:2,name:'yangfan'}]
		},
	]
};

var topic = {
	id:1,
	title:"title~~",
	author:1,
	date:new Date,
	body:"hahahahahahhahahahah~~",
	comments:[
		{id:1,body:"test comment",date:new Date,owner:{id:1,name:'avoid'}}
	]
}

var userList = [user,user];

var project = {
	name: "project",
	startDate: new Date,
	des:"project des"
};

var requireList = [
	{id:1,descripton:"require 1 des",level:2},
	{id:2,descripton:"require 2 des",level:3}
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
////////////////////////////////////////////////////////////////////////////////////////
//
//               router
//
////////////////////////////////////////////////////////////////////////////////////////
module.exports = function(app) {

	/*********************************************************
	 *
	 *  get static html file
	 *
	 */
	//////////////index html
	app.get('/', function (req,res) {
		console.log("request get: /");
		res.render('index', {
			title:'主页',
			user:req.session.user
		});
	});

	//////////////register html
	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req,res){
		console.log('request get: /reg');
		res.render('signup',{
			title:'注册',
			user:req.session.user
		});
	});

	//////////////login html
	app.get('/login', checkNotLogin);
	app.get('/login', function(req,res){
		console.log('request get: /login');
		res.render('login',{
			title: '登录',
			user: req.session.user
		});
	});

	//////////////logout	
    app.get('/logout',checkLogin);
	app.get('/logout', function (req,res) {
		console.log('request get: /logout');
		req.session.user = null;
		res.redirect('/');
	});

	//////////////user html
    app.get('/user/:uid', checkLogin);
    app.get('/user/:uid', checkUser);
	app.get('/user/:uid', function (req,res) {
		console.log('request get: /user/:uid, uid = '+ req.params.uid);
		res.render('user',{
			title:'用户中心',
			user:req.session.user
		});
	});

	//////////////project html
    app.get('/project/:pid', checkLogin);
    app.get('/project/:pid', checkProjectMember);
	app.get('/project/:pid', function (req,res) {
		console.log('request get: /project/:pid, pid = '+ req.params.pid);
		res.render('project',{
			title:"项目",
			user:req.session.user,
			project: project
		});
	});

	/*********************************************************
	 *
	 * browser interact with server	 	
	 *
	 */

	//////////////register
	
	app.post('/reg', function(req,res){
		console.log('request post: /reg');
		////////////////if error
		// res.redirect('/reg');
		////////////////if success   
		   req.session.user = user; //用户信息存入session
		   res.redirect('/');
	});

	//////////////login
	app.post('/login',checkNotLogin);
	app.post('/login', function(req, res){
		console.log('request post: /login');
		 req.session.user = user;
		 res.redirect('/user/0');
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
		res.json(user);
	});

	/////////////////////get one user info by id
	app.get('/API/u/:uid',checkUser);
	app.get('/API/u/:uid',function(req,res){
		console.log('request get: /API/u/:uid, uid = '+ req.params.uid);
		res.json(user);
	});

	/////////////////////for android validate user
	app.post('/API/u',function(req,res){
		console.log('request post: /API/u');
		res.json(success);
	});

	/////////////////////change user information: name, icon, phone, birthady
	app.put('/API/u/:uid',checkUser);
	app.put('/API/u/:uid',function(req,res){
		console.log('request put: /API/u/:uid, uid = '+ req.params.uid);
		res.json(success);
	});

	/////////////////////change user password
	app.put('/API/u/pw/:uid',checkUser);
	app.put('/API/u/pw/:uid',function(req,res){
		console.log('request put: /API/u/pw/:uid, uid = '+ req.params.uid);
		res.json(success);
	});

	/////////////////////get user tasks
	app.get('/API/u/:uid/tasks',checkUser);
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
	app.get('/API/u/:uid/m',checkUser);
	app.get('/API/u/:uid/m',function(req,res){
		console.log('request get: /API/u/:uid/m, uid = '+ req.params.uid);
		res.json(messageList);
	});

	////////////////////set a message to read
	app.put('/API/u/:uid/m/:mid',checkUser);
	app.put('/API/u/:uid/m/:mid',function(req,res){
		console.log('request put: /API/u/:uid/m/:mid, uid = '+ req.params.uid + ' mid = '+ req.params.mid);
		res.json(success);
	});


	/*********************************************************
	 *
	 * project basic APIs	
	 *
	 */
	////////////////////new a proect, post basic project info
	app.post('/API/p',checkUser);
	app.post('/API/p',function(req,res){
		console.log('request post: /API/p');
		res.json(success);
	});

	////////////////////get a proect basic info
	app.get('/API/p/:pid',checkUser);
	app.get('/API/p/:pid',function(req,res){
		console.log('request get: /API/p/:pid, pid = '+ req.params.pid);
		res.json(project);
	});

	////////////////////modify a proect basic info
	app.put('/API/p/:pid',checkUser);
	app.put('/API/p/:pid',function(req,res){
		console.log('request put: /API/p/:pid, pid = '+ req.params.pid);
		res.json(success);
	});

	////////////////////invite a team member by user id
	app.post('/API/p/:pid/mid/:uid',checkUser);
	app.post('/API/p/:pid/mid/:uid',checkProjectAdmin);
	app.post('/API/p/:pid/mid/:uid',function(req,res){
		console.log('request post: /API/p/:pid/m/:uid, pid = '+ req.params.pid+' uid = '+req.params.uid);
		res.json(success);
	});

 	////////////////////invite a team member by Email
	 app.post('/API/p/:pid/me/:email',checkUser);
	 app.post('/API/p/:pid/me/:email',checkProjectAdmin);
	 app.post('/API/p/:pid/me/:email',function(req,res){
	 	console.log('request post: /API/p/:pid/me/:email, pid = '+ 
	 		req.params.pid+ ' email = '+ req.params.email);
	 	res.json(success);
	 });

	////////////////////delete a team member by user id
	app.delete('/API/p/:pid/mid/:uid',checkUser);
	app.delete('/API/p/:pid/mid/:uid',checkProjectAdmin);
	app.delete('/API/p/:pid/mid/:uid',function(req,res){
		console.log('request delete: /API/p/:pid/m/:uid, pid = '+ req.params.pid+' uid = '+req.params.uid);
		res.json(success);
	});

	////////////////////set a team member as Admin
	 app.put('/API/p/:pid/ma/:uid',checkUser);
	 app.put('/API/p/:pid/ma/:uid',checkProjectAdmin);
	 app.put('/API/p/:pid/ma/:uid',function(req,res){
	 	console.log('request put: /API/p/:pid/ma/:uid, pid = '+ 
	 		req.params.pid+ ' uid = '+ req.params.uid);
	 	res.json(success);
	 });

	////////////////////remove admin of a team member
	 app.delete('/API/p/:pid/ma/:uid',checkUser);
	 app.delete('/API/p/:pid/ma/:uid',checkProjectAdmin);
	 app.delete('/API/p/:pid/ma/:uid',function(req,res){
	 	console.log('request delete: /API/p/:pid/ma/:uid, pid = '+ 
	 		req.params.pid+ ' uid = '+ req.params.uid);
	 	res.json(success);
	 });

	/*********************************************************
	 *
	 * project requirements basic APIs	
	 *
	 */
	////////////////////get require list of a project
	app.get('/API/p/:pid/r',checkUser);
	app.get('/API/p/:pid/r',function(req,res){
		console.log('request get: /API/p/:pid/r, pid = '+ req.params.pid);
		res.json(requireList);
	});

	////////////////////delete all requirements of a project
	app.delete('/API/p/:pid/r',checkUser);
	app.delete('/API/p/:pid/r',function(req,res){
		console.log('request delete: /API/p/:pid/r, pid = '+ req.params.pid);
		res.json(success);
	});

	////////////////////add a requirement of a project
	app.post('/API/p/:pid/r',checkUser);
	app.post('/API/p/:pid/r',function(req,res){
		console.log('request post: /API/p/:pid/r, pid = '+ req.params.pid);
		res.json(success);
	});

	////////////////////modify a requirement of a project
	app.put('/API/p/:pid/r/:rid',checkUser);
	app.put('/API/p/:pid/r/:rid',function(req,res){
		console.log('request put: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);
		res.json(success);
	});

	////////////////////delete a requirement of a project
	app.delete('/API/p/:pid/r/:rid',checkUser);
	app.delete('/API/p/:pid/r/:rid',function(req,res){
		console.log('request delete: /API/p/:pid/r/:rid, pid = '+ req.params.pid + ' rid = '+req.params.rid);
		res.json(success);
	});

	

	/*********************************************************
	 *
	 * for project topics
	 *
	 */
	////////////////////get all topics brief description as a list
	app.get('/API/p/:pid/t',checkUser);
	app.get('/API/p/:pid/t',checkProjectMember);
	app.get('/API/p/:pid/t',function(req,res){
		console.log('request get: /API/p/:pid/t, pid = '+ req.params.pid);
		res.json(topicList);
	});

	////////////////////get a detail topic information
	app.get('/API/p/:pid/t/:tid',checkUser);
	app.get('/API/p/:pid/t/:tid',checkProjectMember);
	app.get('/API/p/:pid/t/:tid',function(req,res){
		console.log('request get: /API/p/:pid/t/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);
		res.json(topic);
	});

	////////////////////post a topic to project
	app.post('/API/p/:pid/t',checkUser);
	app.post('/API/p/:pid/t',checkProjectMember);
	app.post('/API/p/:pid/t',function(req,res){
		console.log('request post: /API/p/:pid/t, pid = '+ req.params.pid);
		res.json(success);
	});

	////////////////////delete a detail topic information
	app.delete('/API/p/:pid/t/:tid',checkUser);
	app.delete('/API/p/:pid/t/:tid',checkProjectMember);
	app.delete('/API/p/:pid/t/:tid',function(req,res){
		console.log('request delete: /API/p/:pid/t/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);
		res.json(success);
	});

	////////////////////comment a  topic
	app.post('/API/p/:pid/tc/:tid',checkUser);
	app.post('/API/p/:pid/tc/:tid',checkProjectMember);
	app.post('/API/p/:pid/tc/:tid',function(req,res){
		console.log('request post: /API/p/:pid/tc/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);
		res.json(success);
	});

	////////////////////get comment list
	app.get('/API/p/:pid/tc/:tid',checkUser);
	app.get('/API/p/:pid/tc/:tid',checkProjectMember);
	app.get('/API/p/:pid/tc/:tid',function(req,res){
		console.log('request get: /API/p/:pid/tc/:tid, pid = '+ req.params.pid + ' tid = '+ req.params.tid);
		res.json(topic.comments);
	});

	////////////////////delete a comment
	app.delete('/API/p/:pid/t/:tid/c/:cid',checkUser);
	app.delete('/API/p/:pid/t/:tid/c/:cid',checkProjectAdmin);
	app.delete('/API/p/:pid/t/:tid/c/:cid',function(req,res){
		console.log('request delete: /API/p/:pid/t/:tid/c/:cid, pid = '+ req.params.pid + 
			' tid = '+ req.params.tid + ' cid = '+ req.params.cid);
		res.json(success); 
	});


	/*********************************************************
	 *
	 * for project sprint
	 *
	 */
	////////////////////get all sprint brief description as a list
	app.get('/API/p/:pid/s',checkUser);
	app.get('/API/p/:pid/s',checkProjectMember);
	app.get('/API/p/:pid/s',function(req,res){
		console.log('request get: /API/p/:pid/s, pid = '+ req.params.pid);
		res.json(sprintList);
	});

	////////////////////get a detail sprint information
	app.get('/API/p/:pid/s/:sid',checkUser);
	app.get('/API/p/:pid/s/:sid',checkProjectMember);
	app.get('/API/p/:pid/s/:sid',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(sprint);
	});

	////////////////////new a sprint of a project
	app.post('/API/p/:pid/s',checkUser);
	app.post('/API/p/:pid/s',checkProjectAdmin);
	app.post('/API/p/:pid/s',function(req,res){
		console.log('request post: /API/p/:pid/s, pid = '+ req.params.pid);
		res.json(success);
	});

	////////////////////delete a sprint of a project
	app.delete('/API/p/:pid/s/:sid',checkUser);
	app.delete('/API/p/:pid/s/:sid',checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	////////////////////modify basic info of a sprint of a project
	app.put('/API/p/:pid/s/:sid',checkUser);
	app.put('/API/p/:pid/s/:sid',checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	////////////////////start a sprint of a project
	app.get('/API/p/:pid/s/:sid/start',checkUser);
	app.get('/API/p/:pid/s/:sid/start',checkProjectAdmin);
	app.get('/API/p/:pid/s/:sid/start',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/start, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	////////////////////finish a sprint of a project
	app.get('/API/p/:pid/s/:sid/finish',checkUser);
	app.get('/API/p/:pid/s/:sid/finish',checkProjectAdmin);
	app.get('/API/p/:pid/s/:sid/finish',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/finish, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	/*********************************************************
	 *
	 * for project sprint backlog
	 *
	 */
	////////////////////get backlog of a sprint
	app.get('/API/p/:pid/s/:sid/backlog',checkUser);
	app.get('/API/p/:pid/s/:sid/backlog',checkProjectMember);
	app.get('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(sprint.backlog);
	});

	////////////////////add a piece of backlog for a sprint
	app.post('/API/p/:pid/s/:sid/backlog',checkUser);
	app.post('/API/p/:pid/s/:sid/backlog',checkProjectAdmin);
	app.post('/API/p/:pid/s/:sid/backlog',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/backlog, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	////////////////////modify a piece of backlog for a sprint
	app.put('/API/p/:pid/s/:sid/b/:bid',checkUser);
	app.put('/API/p/:pid/s/:sid/b/:bid',checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		res.json(success);
	});

	////////////////////delete a piece of backlog for a sprint
	app.delete('/API/p/:pid/s/:sid/b/:bid',checkUser);
	app.delete('/API/p/:pid/s/:sid/b/:bid',checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/b/:bid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/b/:bid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' bid = ' + req.params.bid);
		res.json(success);
	});

	/*********************************************************
	*
	* for project sprint defects
	*
	*/
	////////////////////get defects of a sprint
	app.get('/API/p/:pid/s/:sid/defects',checkUser);
	app.get('/API/p/:pid/s/:sid/defects',checkProjectMember);
	app.get('/API/p/:pid/s/:sid/defects',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/defects, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(sprint.defects);
	});

	////////////////////add a defect for a sprint
	app.post('/API/p/:pid/s/:sid/defects',checkUser);
	app.post('/API/p/:pid/s/:sid/defects',checkProjectAdmin);
	app.post('/API/p/:pid/s/:sid/defects',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/defects, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	////////////////////modify defect for a sprint
	app.put('/API/p/:pid/s/:sid/d/:did',checkUser);
	app.put('/API/p/:pid/s/:sid/d/:did',checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/d/:did',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/d/:did, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' did = ' + req.params.did);
		res.json(success);
	});

	////////////////////delete defect for a sprint
	app.delete('/API/p/:pid/s/:sid/d/:did',checkUser);
	app.delete('/API/p/:pid/s/:sid/d/:did',checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/d/:did',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/d/:did, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' did = ' + req.params.did);
		res.json(success);
	});

	/*********************************************************
	 *
	 * for project sprint issues
	 *
	 */
	////////////////////get issues of a sprint
	app.get('/API/p/:pid/s/:sid/issues',checkUser);
	app.get('/API/p/:pid/s/:sid/issues',checkProjectMember);
	app.get('/API/p/:pid/s/:sid/issues',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/issues, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(sprint.issues);
	});

	////////////////////add a issue for a sprint
	app.post('/API/p/:pid/s/:sid/issues',checkUser);
	app.post('/API/p/:pid/s/:sid/issues',checkProjectAdmin);
	app.post('/API/p/:pid/s/:sid/issues',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/issues, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	////////////////////modify a issue for a sprint
	app.put('/API/p/:pid/s/:sid/i/:iid',checkUser);
	app.put('/API/p/:pid/s/:sid/i/:iid',checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		res.json(success);
	});

	////////////////////delete a issue for a sprint
	app.delete('/API/p/:pid/s/:sid/i/:iid',checkUser);
	app.delete('/API/p/:pid/s/:sid/i/:iid',checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/i/:iid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/i/:iid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' iid = ' + req.params.iid);
		res.json(success);
	});

	/*********************************************************
	 *
	 * for project sprint tasks
	 *
	 */
	////////////////////get tasks of a sprint
	app.get('/API/p/:pid/s/:sid/tasks',checkUser);
	app.get('/API/p/:pid/s/:sid/tasks',checkProjectMember);
	app.get('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request get: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(sprint.tasks);
	});

	////////////////////add a task for a sprint
	app.post('/API/p/:pid/s/:sid/tasks',checkUser);
	app.post('/API/p/:pid/s/:sid/tasks',checkProjectAdmin);
	app.post('/API/p/:pid/s/:sid/tasks',function(req,res){
		console.log('request post: /API/p/:pid/s/:sid/tasks, pid = '+ req.params.pid + ' sid = '+ req.params.sid);
		res.json(success);
	});

	////////////////////modify a task for a sprint
	app.put('/API/p/:pid/s/:sid/t/:tid',checkUser);
	app.put('/API/p/:pid/s/:sid/t/:tid',checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/t/:tid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		res.json(success);
	});

	////////////////////delete a task for a sprint
	app.delete('/API/p/:pid/s/:sid/t/:tid',checkUser);
	app.delete('/API/p/:pid/s/:sid/t/:tid',checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/t/:tid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/t/:tid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid);
		res.json(success);
	});

	////////////////////assign a task to a member
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',checkUser);
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',checkProjectAdmin);
	app.put('/API/p/:pid/s/:sid/t/:tid/u/:uid',function(req,res){
		console.log('request put: /API/p/:pid/s/:sid/t/:tid/u/:uid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid + ' uid '+req.params.uid);
		res.json(success);
	});

	////////////////////remove a task from a member
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',checkUser);
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',checkProjectAdmin);
	app.delete('/API/p/:pid/s/:sid/t/:tid/u/:uid',function(req,res){
		console.log('request delete: /API/p/:pid/s/:sid/t/:tid/u/:uid, pid = '+ req.params.pid + 
			' sid = '+ req.params.sid + ' tid = ' + req.params.tid + ' uid '+req.params.uid);
		res.json(success);
	});

	/*********************************************************
	 *
	 * for unsupported URLs
	 *
	 */
	app.use(function(req,res) {
		//res.render("404");
		console.log('unsupported URL');
		res.json(error);
	});
}

////////////////////////////////////////////////////////////////////////////////////////
//
//               helper functions
//
////////////////////////////////////////////////////////////////////////////////////////

function checkLogin(req, res, next){
    if(!req.session.user){
	      return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req,res,next){
    if(req.session.user){
	      return res.redirect('/');
    }
    next();
}

function checkUser(req,res,next){
	next();
}

function checkProjectMember(req,res,next){
	next();
}

function checkProjectAdmin(req,res,next){
	next();
}