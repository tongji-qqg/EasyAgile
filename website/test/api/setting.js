
// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// get the application server module

var Sails = require('sails');
var assert = require("assert");
var expect = require('expect.js');

before(function(done) {			
	Sails.lift({hooks:{i18n: false}, log:{level:'info'}, dbname:'test'}, function(err, _sails){
		if(err) return done(err || 'Sails could not be instantiated.');    		  	
		return done();
	});      		
});

after(function(done) {
	Sails.lower(done);		
});