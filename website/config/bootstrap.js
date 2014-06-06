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

	//just leave this for future use
	if(sails.config.memcached){
		console.log('use memcached '+sails.config.memcached);
		console.log('please make sure install and open memcached service');
		var cache = require('mongoose-memcached');
		var options = {
		  cache: true, // disable caching for all modules by default 
		  ttl: 30,       // set default time to live to be 30 seconds 
		  memServers: 'localhost:11211', // memcached server
		  memOptions: null 
		};
		cache(mongoose, options);
		process.env.memcached = true;
	}


	db = mongoose.connection;
  
    db.on('error', function (err) {
        sails.log.error(err.message);
        sails.log.error('Please check mongodb');
    });

    process.on('exit', function() {
		db.close();
	});
	process.env.port = sails.config.port;
	process.env.host = sails.config.host;
	//sails.log.info('hostname '+sails.config.host+' hostport '+sails.config.port);
  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};