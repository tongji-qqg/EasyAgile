/**
 * SocketioController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
 /**
   * get /API/p/:pid/s/:sid/sub
   * 
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
    subscribeToSprint: function (req, res) {
      
      sails.log.verbose('Controller - api/controller/ProjectController.subscribeToSprint');
      var roomName = 'sprintId_'+req.params.sid
      if(req.socket){
        req.socket.join(roomName);    
        //sails.log.warn('sub'+sails.io.sockets.clients());
        //sails.log.warn('sub'+sails.io.sockets.clients(roomName));     
        res.json(ErrorService.successWithValue('message','Subscribed to room: '+roomName));
      }else{
        res.json(ErrorService.successWithValue('message','Subscribe only open to Socket'));
      }
    },


  /**
   * get /API/p/:pid/sub
   * 
   * @param   {req}   request     Request object
   * @param   {res}  response    Response object
   */
    subscribeToProject: function (req, res) {
      
      sails.log.verbose('Controller - api/controller/ProjectController.subscribeToProject');
      var roomName = 'projectId_'+req.params.pid
      if(req.socket){
        req.socket.join(roomName);                
        res.json(ErrorService.successWithValue('message','Subscribed to room: '+roomName));
      }else{
        res.json(ErrorService.successWithValue('message','Subscribe only open to Socket'));
      }
    },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SocketioController)
   */
  _config: {}

  
};
