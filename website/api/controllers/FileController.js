/**
 * FileController
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
	 * get /API/p/:pid/f
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getFileListOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/FileController.getFileListOfProject');
	    FileService.getFileListOfProject(req.params.pid, function(err, files){
	    	if(err) res.json(err);
	    	else res.json(ErrorService.successWithValue('files', files));
	    })
    },

    /**
	 * post /API/p/:pid/f
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    uploadFilesToProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/FileController.uploadFilesToProject');
	    if( _.isArray(req.files.files) ){
	    	FileService.uploadFilesToProject(req.session.user._id, req.params.pid, req.files.files, function(err){
		    	if(err) res.json(err);
		    	else res.redirect('/project_files/'+req.params.pid);
		    });
	    }else{	    
		    FileService.uploadFileToProject(req.session.user._id, req.params.pid, req.files.files, function(err){
		    	if(err) res.json(err);
		    	else res.redirect('/project_files/'+req.params.pid);
		    });
		}
    },

    /**
	 * get /API/p/:pid/f/:fid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    getOneFileOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/FileController.getFileOfProject');
	    FileService.downloadFileFromProject(req.params.pid, req.params.fid, function(err, file){
	    	if(err) return res.json(err);	    	
	    	res.download(file.path,file.name);
	    });
    },

    /**
	 * delete /API/p/:pid/f/:fid
	 * 
	 * @param   {req}   request     Request object
	 * @param   {res}  response    Response object
	 */
    deleteOneFileOfProject: function (req, res) {
      
	    sails.log.verbose('Controller - api/controller/FileController.deleteFileOfProject');
	    FileService.deleteFileOfProject(req.params.pid, req.params.fid, function(err, file){
	    	if(err) res.json(err);	    	
	    	else res.json(ErrorService.success);
	    });
    },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to FileController)
   */
  _config: {}

  
};
