////////////////////////////////////////////////////////////////////////////////////////
//
//            require modules
//
////////////////////////////////////////////////////////////////////////////////////////


var F = require('./functions');

var staticRouter = require('./staticRouter')
	, userRouter = require('./userRouter')
	, projectRouter = require('./projectRouter')
	, rrRouter   = require('./rrRouter')
	, sprintRouter = require('./sprintRouter')
	, bdiRouter = require('./bdiRouter')
	, taskRouter = require('./taskRouter')
	, topicRouter = require('./topicRouter');

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
	rrRouter(app);


	

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
	bdiRouter(app);




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