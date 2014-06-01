var chai = require('chai');
var casper_chai = require('casper-chai');
chai.use(casper_chai);
var should = chai.should();
var HOSTPATH = 'http://localhost:18080/';

////////////////////////////////////////////////////

//---------specify login page function------------//

////////////////////////////////////////////////////

describe('Login page', function(){
	before(function() {
	    casper.open(HOSTPATH+'login')
	})
	it('should be login page',function(){
		casper.then(function(){
	  		'Easy Agile - login'.should.matchTitle  		
	  	});
	});

	it('should refuse empty submissions');

	it('should refuse partial submissions');

	it('should refuse invalid emails');

	it('should accept complete submissions',function(){
		casper.then(function(){
			this.fill('form[action="/login"]', {
		        emailaddress: 'playwew@126.com',
		        password:'whoami'
		    }, true)
		});
		casper.then(function(){
			'用户中心'.should.matchTitle
		});		
	});
})