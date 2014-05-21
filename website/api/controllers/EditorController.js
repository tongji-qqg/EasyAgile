/**
 * EditorController
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
var _ = require('underscore');

module.exports = {
    
  	/**
	 * get /API/p/:pid/e
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    get: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/EditorController.get');
	    EditorService.get(req.params.pid, function(err, editors){

	    	if(err) res.json(err);
	    	else res.json(ErrorService.successWithValue('editor', editors));
	    })
    },

	/**
	 * post /API/p/:pid/e
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    create: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/EditorController.create');
	    EditorService.create(req.params.pid, {
	    	name: req.body.name,
	    	type: req.body.type	    	
	    },function(err,p){
	    	if(err) res.json(err);
	    	else res.json(ErrorService.successWithValue('file', _.last(p.editor)));
	    	//else res.redirect('/project_editor/'+req.params.pid);
	    })
    },

    /**
	 * get /API/p/:pid/e/:eid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    edit: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/EditorController.edit');
	    
    },

    /**
	 * delete /API/p/:pid/e/:eid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    delete: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/EditorController.delete');
	    EditorService.delete(req.params.pid, req.params.eid, function(err, editors){

	    	if(err) res.json(err);
	    	else res.json(ErrorService.successWithValue('editor', editors));
	    })
    },    

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to EditorController)
   */
  _config: {}

  
};
