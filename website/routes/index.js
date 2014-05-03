////////////////////////////////////////////////////////////////////////////////////////
//
//            require modules
//
////////////////////////////////////////////////////////////////////////////////////////


var F = require('./functions');

var staticRouter = require('./staticRouter')
	, userRouter = require('./userRouter')
	, projectRouter = require('./projectRouter')
	, rriRouter   = require('./rriRouter')
	, sprintRouter = require('./sprintRouter')
	, backlogRouter = require('./backlogRouter')
	, taskRouter = require('./taskRouter')
	, topicRouter = require('./topicRouter');


var error = require('../service/errorDefine').urlError;

var success = require('../service/errorDefine').success;

////////////////////////////////////////////////////////////////////////////////////////
//
//               router
//
////////////////////////////////////////////////////////////////////////////////////////
module.exports = function(app) {

	app.use(function(req,res,next){
		console.log('request URL: '+req.url);
		next();
	});


	/*********************************************************
	 *
	 *  get static html file
	 *
	 *  /, /reg, /login, /logout, /user/:uid, /project/:pid
	 *	 
	 */


	staticRouter(app);






	/*********************************************************
	 *
	 * browser interact with server	 	
	 *
	 */
	/*********************************************************
	 *
	 * user APIs	
	 *
	 */
	/*********************************************************
	 *
	 * for user message
	 *
	 */


	 userRouter(app);






	/*********************************************************
	 *
	 * project basic APIs	
	 *
	 */
	////////////////////new a proect, post basic project info
	projectRouter(app);




	
	/*********************************************************
	 *
	 * project requirements and releases basic APIs	
	 *
	 */
	rriRouter(app);


	

	/*********************************************************
	 *
	 * for project topics
	 *
	 */
	topicRouter(app);




	/*********************************************************
	 *
	 * for project sprint
	 *
	 */
	sprintRouter(app);





	/*********************************************************
	 *
	 * for project sprint backlog
	 *
	 */
	/*********************************************************
	*
	* for project sprint defects
	*
	*/
	/*********************************************************
	 *
	 * for project sprint issues
	 *
	 */
	backlogRouter(app);




	/*********************************************************
	 *
	 * for project sprint tasks
	 *
	 */
	taskRouter(app);





	/*********************************************************
	 *
	 * for unsupported URLs
	 *
	 */
	app.use(function(req,res) {
		//res.render("404");
		console.log('unsupported URL:'+req.url);
		res.json(error);
	});
};