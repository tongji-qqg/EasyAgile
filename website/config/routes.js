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
  'get /mobile'                                 : 'static.mobile',
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
  'get /project_members/:pid'                   : 'static.projectMembers',
  'get /project_newTopic/:pid'                  : 'static.projectNewTopic',
  'get /project_oneTopic/:pid/t/:tid'           : 'static.projectOneTopic',
  'get /project_history/:pid'                   : 'static.projectHistory',
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
  'delete  /API/a/:aid'                         : 'user.deleteAlertById',
  'delete  /API/a'                              : 'user.deleteAllAlert',        
  //project 9
  'post    /API/p'                              : 'project.createProject',
  'get     /API/p/:pid'                         : 'project.getProjectInfo',
  'put     /API/p/:pid'                         : 'project.editProjectInfo',
  'delete  /API/p/:pid'                         : 'project.deleteProject',
  'put     /API/pf/:pid'                        : 'project.finishProject',
  'put     /API/ps/:pid'                        : 'project.startProject',
  'post    /API/p/:pid/mid/:uid'                : 'project.inviteMemberById',
  'get     /API/p/:pid/inviteById/accept'       : 'project.acceptInviteById',
  'get     /API/p/:pid/inviteById/reject'       : 'project.rejectInviteById',
  'post    /API/p/:pid/me/:email'               : 'project.inviteMemberByEmail',

  'delete  /API/p/:pid/mid/:uid'                : 'project.removeMemberById',
  'put     /API/p/:pid/ma/:uid'                 : 'project.setMemberAdmin',
  'delete  /API/p/:pid/ma/:uid'                 : 'project.removeMemberAdmin', 
  'put     /API/p/:pid/mg/:uid'                 : 'project.setMemberGroup',
  'post    /API/p/:pid/g'                       : 'project.addGroup',
  'delete  /API/p/:pid/g'                       : 'project.deleteGroup',
  'get     /API/p/:pid/h'                       : 'project.getHistory',
  'get     /API/p/:pid/h/:from/:to'             : 'project.getHistoryFromTo',
  'get     /API/p/:pid/members'                 : 'project.getMembers',
  'get     /API/p/:pid/inviteByEmail/:email/token/:token/accept' : 'project.acceptInviteByEmail',
  'get     /API/p/:pid/inviteByEmail/:email/token/:token/reject' : 'project.rejectInviteByEmail',
  'get     /API/reg/p/:pid/inviteByEmail/:email/token/:token'    : 'project.getRegInviteByEmail',
  'post    /API/invite/register'                : 'project.postRegInviteByEmail',
  //editor 6
  'get     /API/p/:pid/e'                       : 'editor.get',
  'post    /API/p/:pid/e'                       : 'editor.create',
//  'get     /API/p/:pid/e/:eid'                  : 'editor.edit',     
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
  'get    /API/p/:pid/s/:sid/h'                 : 'sprint.getHistory',
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
  'get     /API/p/:pid/s/:sid/t/:tid/h'         : 'task.getHistory',
  //topic 7
  'get    /API/p/:pid/t'                        :  'topic.getAllTopics',
  'get    /API/p/:pid/t/:tid'                   :  'topic.getOneTopic',
  'post   /API/p/:pid/t'                        :  'topic.createTopic',
  'delete /API/p/:pid/t/:tid'                   :  'topic.deleteTopic',
  'post   /API/p/:pid/tc/:tid'                  :  'topic.commentTopic',
  'get    /API/p/:pid/tc/:tid'                  :  'topic.getComments',
  'delete /API/p/:pid/t/:tid/c/:cid'            :  'topic.deleteComment',
  //socket.io
  'get     /API/u/:uid/sub'                     :  'socketio.subscribeToUser',
  'get     /API/p/:pid/sub'                     :  'socketio.subscribeToProject',
  'get     /API/p/:pid/s/:sid/sub'              :  'socketio.subscribeToSprint',

  //files
  'get      /API/p/:pid/f'                      :  'file.getFileListOfProject',
  'post     /API/p/:pid/f'                      :  'file.uploadFilesToProject',
  'get      /API/p/:pid/f/:fid'                 :  'file.getOneFileOfProject',
  'delete   /API/p/:pid/f/:fid'                 :  'file.deleteOneFileOfProject',
}