/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */
'use strict'

module.exports.policies = {

  	// Default policy for all controllers and actions
  	// (`true` allows public access) 
  	'*': false,

  	// whitelist the auth controller, this is used for login
    "auth": {
        "*": false,

        // Custom actions
        login         :["flashMessage", "checkNotLogin"],
		reg           :["flashMessage", "checkNotLogin"],
		logout   	  :["flashMessage", "checkLogin"],
		activateEmail : [true],
    },
    "backlog": {
        "*": false,

        // Custom actions
		getBacklogOfProject       :["validateURLID", "checkUser"],
		addBacklogOfProject       :["validateURLID", "checkUser"],
		modifyBacklogOfProject    :["validateURLID", "checkUser"],
		modifyAllBacklogOfProject :["validateURLID", "checkUser"],
		deleteBacklogOfProject    :["validateURLID", "checkUser"],
		deleteAllBacklogOfProject :["validateURLID", "checkUser"],
    },
    "issue": {
        "*": false,

        // Custom actions
		getAllIssues    : ["validateURLID", "checkUser", "hasProjectAccess"],
		deleteAllIssues : ["validateURLID", "checkUser", "hasProjectAdmin"],
		addOneIssue     : ["validateURLID", "checkUser", "hasProjectAccess"],
		modifyOneIssue  : ["validateURLID", "checkUser", "hasProjectAccess"],
		modifyAllIssue  : ["validateURLID", "checkUser", "hasProjectAccess"],
		deleteOneIssue  : ["validateURLID", "checkUser", "hasProjectAdmin"],
    },
    "project": {
        "*": true,

        // Custom actions
		createProject      : ["checkUser"],
		getProjectInfo     : ["validateURLID", "checkUser", "hasProjectAccess"],
		editProjectInfo    : ["validateURLID", "checkUser", "hasProjectAdmin"],
		deleteProject      : ["validateURLID", "checkUser", "hasProjectOwner"],
		finishProject      : ["validateURLID", "checkUser", "hasProjectAdmin"],
		inviteMemberById   : ["validateURLID", "checkUser", "hasProjectAdmin"],
		inviteMemberByEmail: ["validateURLID", "checkUser", "hasProjectAdmin"],
		removeMemberById   : ["validateURLID", "checkUser", "hasProjectAdmin"],
		setMemberAdmin     : ["validateURLID", "checkUser", "hasProjectAdmin"],
		removeMemberAdmin  : ["validateURLID", "checkUser", "hasProjectAdmin"],
		
    },
    "sprint": {
        "*": false,

        // Custom actions
		getAllSprints : ["validateURLID", "checkUser", "hasProjectAccess"],
		createSprint  : ["validateURLID", "checkUser", "hasProjectAdmin"],
		getOneSprint  : ["validateURLID", "checkUser", "hasProjectAccess", "sprintInProject"],		
		deleteSprint  : ["validateURLID", "checkUser", "hasProjectAdmin", "sprintInProject"],
		modifySprint  : ["validateURLID", "checkUser", "hasProjectAdmin", "sprintInProject"],
		startSprint   : ["validateURLID", "checkUser", "hasProjectAdmin", "sprintInProject"],
		finishSprint  : ["validateURLID", "checkUser", "hasProjectAdmin", "sprintInProject"],
    },
    "static": {
        "*": false,

        // Custom actions
        index            :[true],
		reg              :["flashMessage", "checkNotLogin"],
		login            :["flashMessage", "checkNotLogin"],
		userMain         :["validateURLID", "checkLogin"],
		userTask         :["validateURLID", "checkLogin"],
		userCal          :["validateURLID", "checkLogin"],
		userMessage      :["validateURLID", "checkLogin"],

		projectMain      :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectTaskboard :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectCal       :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectIssue     :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectFiles     :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectTopic	 :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectNewTopic	 :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectOneTopic	 :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectEditor    :["validateURLID", "checkLogin", "hasProjectAccess"],
		projectMembers   :["validateURLID", "checkLogin", "hasProjectAccess"],
    },

    "story": {
        "*": false,

        // Custom actions
		getAllStorys    :["validateURLID", "checkUser", "hasProjectAccess"],
		deleteAllStorys :["validateURLID", "checkUser", "hasProjectAccess"],
		addOneStory     :["validateURLID", "checkUser", "hasProjectAccess"],
		modifyOneStory  :["validateURLID", "checkUser", "hasProjectAccess"],
		modifyAllStory  :["validateURLID", "checkUser", "hasProjectAccess"],
		deleteOneStory  :["validateURLID", "checkUser", "hasProjectAccess"],
    },
    "task": {
        "*": false,

        // Custom actions
		getTasksOfSprint     : ["validateURLID", "checkUser", "hasProjectAccess", "sprintInProject"],
		addTaskOfSprint      : ["validateURLID", "checkUser", "hasProjectAccess", "sprintInProject", "validateTaskOwner"],
		modifyTaskOfSprint   : ["validateURLID", "checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint", "validateTaskOwner"],
		setTaskProgress      : ["validateURLID", "checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		deleteTaskOfSprint   : ["validateURLID", "checkUser", "hasProjectAdmin",  "sprintInProject", "taskInSprint"],
		setTaskToBacklog     : ["validateURLID", "checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		unsetTaskToBacklog   : ["validateURLID", "checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		assignTaskToMember   : ["validateURLID", "checkUser", "hasProjectAdmin",  "sprintInProject", "taskInSprint"],
		removeTaskFromMember : ["validateURLID", "checkUser", "hasProjectAdmin",  "sprintInProject", "taskInSprint"],
		removeAllTaskOwner   : ["validateURLID", "checkUser", "hasProjectAdmin",  "sprintInProject", "taskInSprint"],
    },
    "topic": {
        "*": false,

        // Custom actions
		getAllTopics  : ["validateURLID", "checkUser", "hasProjectAccess"],
		getOneTopic   : ["validateURLID", "checkUser", "hasProjectAccess"],
		createTopic   : ["validateURLID", "checkUser", "hasProjectAccess"],
		deleteTopic   : ["validateURLID", "checkUser", "hasProjectAdmin"],
		commentTopic  : ["validateURLID", "checkUser", "hasProjectAccess"],
		getComments   : ["validateURLID", "checkUser", "hasProjectAccess"],
		deleteComment : ["validateURLID", "checkUser", "hasProjectAdmin"],
    },
    "user": {
        "*": false,

        // Custom actions
        validateUserByEmail  :["checkNoUser"],
    	getUserInfoLikeName  :["checkUser"],
    	getUserInfoByEmail   :["checkUser"],
    	getUserInfoById      :["checkUser"],    	
    	editUserInfoById     :["checkUser"],
    	changePasswordById   :["checkUser"],
    	getAllUserTask       :["checkUser"],
    	getCurrentUserTask   :["checkUser"],
    	getUserProjects      :["checkUser"],
    	setUserIconById      :["validateURLID", "checkUser"],
    	setTask              :["validateURLID", "checkUser","validateTaskOwner"],

    	getUserMessage       :["validateURLID", "checkUser"], 
		sendMessage          :["validateURLID", "checkUser"],    	
		getAllUserMessage    :["checkUser"],
		readMessage          :["validateURLID", "checkUser"],
		getUserAlert         :["checkUser"],
		getAllUserAlert      :["checkUser"],
		readAlert            :["validateURLID", "checkUser"]
    },
    "socketio":{
    	"*": false,
    	subscribeToSprint  : [],//["checkUser", "hasProjectAccess", "sprintInProject"],
    	subscribeToProject : [],//["checkUser", "hasProjectAccess"], not work for socket connect
    },
    "file":{
    	"*":false,
    	getFileListOfProject    : ["validateURLID", "checkUser","hasProjectAccess"],
		uploadFilesToProject    : ["validateURLID", "checkUser","hasProjectAccess"],
		getOneFileOfProject     : ["validateURLID", "checkUser","hasProjectAccess"],
		deleteOneFileOfProject  : ["validateURLID", "checkUser","hasProjectAdmin"],
    },
    "editor":{
    	"*": false,
    	get         : ["validateURLID", "checkUser","hasProjectAccess"],
    	create      : ["validateURLID", "checkUser","hasProjectAccess"],
    	edit        : ["validateURLID", "checkUser","hasProjectAccess"],
    	delete      : ["validateURLID", "checkUser","hasProjectAccess"],
    }
  /*
	// Here's an example of adding some policies to a controller
	RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		'*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy 
		// (this overrides `false` above)
		nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		feed : ['isNiceToAnimals', 'hasRabbitFood']
	}
	*/
};


/**
 * Here's what the `isNiceToAnimals` policy from above might look like:
 * (this file would be located at `policies/isNiceToAnimals.js`)
 *
 * We'll make some educated guesses about whether our system will
 * consider this user someone who is nice to animals.
 *
 * Besides protecting rabbits (while a noble cause, no doubt), 
 * here are a few other example use cases for policies:
 *
 *	+ cookie-based authentication
 *	+ role-based access control
 *	+ limiting file uploads based on MB quotas
 *	+ OAuth
 *	+ BasicAuth
 *	+ or any other kind of authentication scheme you can imagine
 *
 */

/*
module.exports = function isNiceToAnimals (req, res, next) {
	
	// `req.session` contains a set of data specific to the user making this request.
	// It's kind of like our app's "memory" of the current user.
	
	// If our user has a history of animal cruelty, not only will we 
	// prevent her from going even one step further (`return`), 
	// we'll go ahead and redirect her to PETA (`res.redirect`).
	if ( req.session.user.hasHistoryOfAnimalCruelty ) {
		return res.redirect('http://PETA.org');
	}

	// If the user has been seen frowning at puppies, we have to assume that
	// they might end up being mean to them, so we'll 
	if ( req.session.user.frownsAtPuppies ) {
		return res.redirect('http://www.dailypuppy.com/');
	}

	// Finally, if the user has a clean record, we'll call the `next()` function
	// to let them through to the next policy or our controller
	next();
};
*/
