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
  	'*': true,

  	// whitelist the auth controller, this is used for login
    "auth": {
        "*": true,

        // Custom actions
        login    :["flashMessage", "checkNotLogin"],
		reg      :["flashMessage", "checkNotLogin"],
		logout   :["flashMessage", "checkLogin"]
    },
    "backlog": {
        "*": false,

        // Custom actions
		getBacklogOfProject       :["checkUser"],
		addBacklogOfProject       :["checkUser"],
		modifyBacklogOfProject    :["checkUser"],
		modifyAllBacklogOfProject :["checkUser"],
		deleteBacklogOfProject    :["checkUser"],
		deleteAllBacklogOfProject :["checkUser"],
    },
    "issue": {
        "*": false,

        // Custom actions
		getAllIssues    : ["checkUser", "hasProjectAccess"],
		deleteAllIssues : ["checkUser", "hasProjectAdmin"],
		addOneIssue     : ["checkUser", "hasProjectAccess"],
		modifyOneIssue  : ["checkUser", "hasProjectAccess"],
		modifyAllIssue  : ["checkUser", "hasProjectAccess"],
		deleteOneIssue  : ["checkUser", "hasProjectAdmin"],
    },
    "project": {
        "*": true,

        // Custom actions
		createProject      : ["checkUser"],
		getProjectInfo     : ["checkUser", "hasProjectAccess"],
		editProjectInfo    : ["checkUser", "hasProjectAdmin"],
		deleteProject      : ["checkUser", "hasProjectOwner"],
		finishProject      : ["checkUser", "hasProjectAdmin"],
		inviteMemberById   : ["checkUser", "hasProjectAdmin"],
		inviteMemberByEmail: ["checkUser", "hasProjectAdmin"],
		removeMemberById   : ["checkUser", "hasProjectAdmin"],
		setMemberAdmin     : ["checkUser", "hasProjectAdmin"],
		removeMemberAdmin  : ["checkUser", "hasProjectAdmin"],
    },
    "sprint": {
        "*": false,

        // Custom actions
		getAllSprints : ["checkUser", "hasProjectAccess"],
		createSprint  : ["checkUser", "hasProjectAdmin"],
		getOneSprint  : ["checkUser", "hasProjectAccess", "sprintInProject"],		
		deleteSprint  : ["checkUser", "hasProjectAdmin", "sprintInProject"],
		modifySprint  : ["checkUser", "hasProjectAdmin", "sprintInProject"],
		startSprint   : ["checkUser", "hasProjectAdmin", "sprintInProject"],
		finishSprint  : ["checkUser", "hasProjectAdmin", "sprintInProject"],
    },
    "static": {
        "*": false,

        // Custom actions
        index            :[true],
		reg              :["flashMessage", "checkNotLogin"],
		login            :["flashMessage", "checkNotLogin"],
		userMain         :["checkLogin"],
		userTask         :["checkLogin"],
		userCal          :["checkLogin"],
		userMessage      :["checkLogin"],
		projectMain      :["checkLogin"],
		projectTaskboard :["checkLogin"],
		projectCal       :["checkLogin"],
		projectIssue     :["checkLogin"],
		projectFiles     :["checkLogin"],
		projectTopic	 :["checkLogin"],
    },

    "story": {
        "*": false,

        // Custom actions
		getAllStorys    :["checkUser", "hasProjectAccess"],
		deleteAllStorys :["checkUser", "hasProjectAccess"],
		addOneStory     :["checkUser", "hasProjectAccess"],
		modifyOneStory  :["checkUser", "hasProjectAccess"],
		modifyAllStory  :["checkUser", "hasProjectAccess"],
		deleteOneStory  :["checkUser", "hasProjectAccess"],
    },
    "task": {
        "*": false,

        // Custom actions
		getTasksOfSprint     : ["checkUser", "hasProjectAccess", "sprintInProject"],
		addTaskOfSprint      : ["checkUser", "hasProjectAccess", "sprintInProject"],
		modifyTaskOfSprint   : ["checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		setTaskProgress      : ["checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		deleteTaskOfSprint   : ["checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		setTaskToBacklog     : ["checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		unsetTaskToBacklog   : ["checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		assignTaskToMember   : ["checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
		removeTaskFromMember : ["checkUser", "hasProjectAccess", "sprintInProject", "taskInSprint"],
    },
    "topic": {
        "*": false,

        // Custom actions
		getAllTopics  : ["checkUser", "hasProjectAccess"],
		getOneTopic   : ["checkUser", "hasProjectAccess"],
		createTopic   : ["checkUser", "hasProjectAccess"],
		deleteTopic   : ["checkUser", "hasProjectAdmin"],
		commentTopic  : ["checkUser", "hasProjectAccess"],
		getComments   : ["checkUser", "hasProjectAccess"],
		deleteComment : ["checkUser", "hasProjectAdmin"],
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

    	getUserMessage       :["checkUser"], 
		sendMessage          :["checkUser"],    	
		getAllUserMessage    :["checkUser"],
		readMessage          :["checkUser"],
		getUserAlert         :["checkUser"],
		getAllUserAlert      :["checkUser"],
		readAlert            :["checkUser"]
    },
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
