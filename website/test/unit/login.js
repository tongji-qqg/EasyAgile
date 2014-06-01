
// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// get the application server module

var Sails = require('sails');
var assert = require("assert");
var expect = require('expect.js');

before(function(done) {			
	Sails.lift({hooks:{i18n: false}, log:{level:'info'}}, function(err, _sails){
		if(err) return done(err || 'Sails could not be instantiated.');    		  	
		return done();
	});      		
});

after(function(done) {
	Sails.lower(done);		
});

describe('Login page', function() {	

	
  	// load the contact page
  	before(function(done) {
  		done();    	
  	});
  	
  	it('should show contact a form',function(){  		
  		
  	});
  	it('should refuse empty submissions', function(done) {
	    done();
	});
  	it('should refuse partial submissions');
  	it('should keep values on partial submissions');
  	it('should refuse invalid emails');
  	it('should accept complete submissions', function(done) {
	    done();
	});
});