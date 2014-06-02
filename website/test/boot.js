
// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// get the application server module

var Sails = require('sails');
var pid = 'xxx';
before(function(done) {			
	Sails.lift({log:{level:'error'}, dbname:'easyagile'}, function(err, sails){
		if(err) return done(err || 'Sails could not be instantiated.');    		  	
		sails.localAppURL = localAppURL = ( sails.usingSSL ? 'https' : 'http' ) + '://' + sails.config.host + ':' + sails.config.port + '';
		return done();		
	});      		
});

after(function(done) {
	Sails.lower(done);		
});

