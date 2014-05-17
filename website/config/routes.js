/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */



/**
 * (1) Core middleware
 *
 * Middleware included with `app.use` is run first, before the router
 */


/**
 * (2) Static routes
 *
 * This object routes static URLs to handler functions--
 * In most cases, these functions are actions inside of your controllers.
 * For convenience, you can also connect routes directly to views or external URLs.
 *
 */

module.exports.routes = {

  // By default, your root route (aka home page) points to a view
  // located at `views/home/index.ejs`
  // 
  // (This would also work if you had a file at: `/views/home.ejs`)

  //static 13
  'get /'                                       : 'static.index',
  'get /reg'                                    : 'static.reg',
  'get /login'                                  : 'static.login',
  'get /user/:uid'                              : 'static.userMain',
  'get /user_task/:uid'                         : 'static.userTask',
  'get /user_cal/:uid'                          : 'static.userCal',
  'get /user_message/:uid'                      : 'static.userMessage',

  'get /project/:pid'                           : 'static.projectMain',
  'get /project_taskboard/:pid'                 : 'static.projectTaskboard',
  'get /project_cal/:pid'                       : 'static.projectCal',
  'get /project_issue/:pid'                     : 'static.projectIssue',
  'get /project_files/:pid'                     : 'static.projectFiles',
  'get /project_topic/:pid'                     : 'static.projectTopic',
  'get /project_editor/:pid'                    : 'static.projectEditor',
  'get /project_newTopic/:pid'                  : 'static.projectNewTopic',

  //auth 4
  'post /login'                                 : 'auth.login',
  'post /reg'                                   : 'auth.reg',                  
  'get  /logout'                                : 'auth.logout',
  'get  /API/logout'                            : 'auth.apilogout',
  'get  /auth/e/:email/t/:token'                : 'auth.activateEmail',
  //user 9
  'get  /API/u/name/:name'                      : 'user.getUserInfoLikeName',  
  'get  /API/u/name'                            : 'user.getUserInfoLikeName',  
  'get  /API/u/email/:email'                    : 'user.getUserInfoByEmail',   
  'get  /API/u'                                 : 'user.getUserInfoById',
  'post /API/u'                                 : 'user.validateUserByEmail',
  'put  /API/u'                                 : 'user.editUserInfoById',
  'put  /API/u/pw'                              : 'user.changePasswordById',
  'get  /API/u/ta'                              : 'user.getAllUserTask',       
  'get  /API/u/tc'                              : 'user.getCurrentUserTask',   
  'get  /API/u/projects'                        : 'user.getUserProjects',
  'put  /API/u/:uid/t/:tid'                     : 'user.setTask',
  'post /API/u/:uid/icon'                       : 'user.setUserIconById',
  //message 7
  'get  /API/m'                                 : 'user.getUserMessage',       
  'post /API/m/u/:uid'                          : 'user.sendMessage',          
  'get  /API/ma'                                : 'user.getAllUserMessage',    
  'put  /API/m/:mid'                            : 'user.readMessage',          
  'get  /API/a'                                 : 'user.getUserAlert',         
  'get  /API/aa'                                : 'user.getAllUserAlert',      
  'put  /API/a/:aid'                            : 'user.readAlert',            
  //project 9
  'post    /API/p'                              : 'project.createProject',
  'get     /API/p/:pid'                         : 'project.getProjectInfo',
  'put     /API/p/:pid'                         : 'project.editProjectInfo',
  'delete  /API/p/:pid'                         : 'project.deleteProject',
  'put     /API/pf/:pid'                        : 'project.finishProject',
  'post    /API/p/:pid/mid/:uid'                : 'project.inviteMemberById',
  'post    /API/p/:pid/me/:email'               : 'project.inviteMemberByEmail',
  'delete  /API/p/:pid/mid/:uid'                : 'project.removeMemberById',
  'put     /API/p/:pid/ma/:uid'                 : 'project.setMemberAdmin',
  'delete  /API/p/:pid/ma/:uid'                 : 'project.removeMemberAdmin', 
  //editor 6
  'get     /API/p/:pid/e'                       : 'editor.get',
  'post    /API/p/:pid/e'                       : 'editor.create',
  'get     /API/p/:pid/e/:eid'                  : 'editor.edit',     //this return static
  'delete  /API/p/:pid/e/:eid'                  : 'editor.delete',

  //backlog 6
  'get     /API/p/:pid/s/:sid/b'                : 'backlog.getBacklogOfProject',
  'post    /API/p/:pid/s/:sid/b'                : 'backlog.addBacklogOfProject',
  'put     /API/p/:pid/s/:sid/b/:bid'           : 'backlog.modifyBacklogOfProject',
//'put     /API/p/:pid/s/:sid/b'                : 'backlog.modifyAllBacklogOfProject',  //not open
  'delete  /API/p/:pid/s/:sid/b/:bid'           : 'backlog.deleteBacklogOfProject',
  'delete  /API/p/:pid/s/:sid/b'                : 'backlog.deleteAllBacklogOfProject',
  //story 6
  'get     /API/p/:pid/r'                       : 'story.getAllStorys',
  'delete  /API/p/:pid/r'                       : 'story.deleteAllStorys',
  'post    /API/p/:pid/r'                       : 'story.addOneStory',
//'put     /API/p/:pid/r'                       : 'story.modifyAllStory',   //not open
  'put     /API/p/:pid/r/:rid'                  : 'story.modifyOneStory',
  'delete  /API/p/:pid/r/:rid'                  : 'story.deleteOneStory',
  //issue 6
  'get     /API/p/:pid/i'                       : 'issue.getAllIssues',
  'post    /API/p/:pid/i'                       : 'issue.addOneIssue',
  'put     /API/p/:pid/i/:iid'                  : 'issue.modifyOneIssue',
//'put     /API/p/:pid/i'                       : 'issue.modifyAllIssue',   //not open
  'delete  /API/p/:pid/i/:iid'                  : 'issue.deleteOneIssue',
  'delete  /API/p/:pid/i'                       : 'issue.deleteAllIssues',
  //sprint 7
  'get    /API/p/:pid/s'                        : 'sprint.getAllSprints',
  'get    /API/p/:pid/s/:sid'                   : 'sprint.getOneSprint',
  'post   /API/p/:pid/s'                        : 'sprint.createSprint',
  'delete /API/p/:pid/s/:sid'                   : 'sprint.deleteSprint',
  'put    /API/p/:pid/s/:sid'                   : 'sprint.modifySprint',
  'get    /API/p/:pid/s/:sid/start'             : 'sprint.startSprint',
  'get    /API/p/:pid/s/:sid/finish'            : 'sprint.finishSprint',
  //task 8
  'get     /API/p/:pid/s/:sid/t'                : 'task.getTasksOfSprint',
  'post    /API/p/:pid/s/:sid/t'                : 'task.addTaskOfSprint',
  'put     /API/p/:pid/s/:sid/t/:tid'           : 'task.modifyTaskOfSprint',
  'put     /API/p/:pid/s/:sid/t/:tid/progress'  : 'task.setTaskProgress',
  'delete  /API/p/:pid/s/:sid/t/:tid'           : 'task.deleteTaskOfSprint',
  'put     /API/p/:pid/s/:sid/t/:tid/b/:bid'    : 'task.setTaskToBacklog',    
  'put     /API/p/:pid/s/:sid/t/:tid/nob'       : 'task.unsetTaskToBacklog',  
  'put     /API/p/:pid/s/:sid/t/:tid/u/:uid'    : 'task.assignTaskToMember',  
  'delete  /API/p/:pid/s/:sid/t/:tid/u/:uid'    : 'task.removeTaskFromMember',
  'delete  /API/p/:pid/s/:sid/t/:tid/ua'        : 'task.removeAllTaskOwner',
  //topic 7
  'get    /API/p/:pid/t'                        :  'topic.getAllTopics',
  'get    /API/p/:pid/t/:tid'                   :  'topic.getOneTopic',
  'post   /API/p/:pid/t'                        :  'topic.createTopic',
  'delete /API/p/:pid/t/:tid'                   :  'topic.deleteTopic',
  'post   /API/p/:pid/tc/:tid'                  :  'topic.commentTopic',
  'get    /API/p/:pid/tc/:tid'                  :  'topic.getComments',
  'delete /API/p/:pid/t/:tid/c/:cid'            :  'topic.deleteComment',
  //socket.io
  'get     /API/p/:pid/sub'                     :  'socketio.subscribeToProject',
  'get     /API/p/:pid/s/:sid/sub'              :  'socketio.subscribeToSprint',

  //files
  'get      /API/p/:pid/f'                      :  'file.getFileListOfProject',
  'post     /API/p/:pid/f'                      :  'file.uploadFilesToProject',
  'get      /API/p/:pid/f/:fid'                 :  'file.getOneFileOfProject',
  'delete   /API/p/:pid/f/:fid'                 :  'file.deleteOneFileOfProject',
}