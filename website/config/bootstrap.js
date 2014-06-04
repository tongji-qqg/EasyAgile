/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

	var mongoose = require('mongoose');
	var dbname = sails.config.dbname || 'easyagile'
	mongoose.connect('mongodb://localhost/' + dbname+'?poolSize=200');

	process.env.port = sails.config.port;
	process.env.host = sails.config.host;
	//sails.log.info('hostname '+sails.config.host+' hostport '+sails.config.port);
  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};