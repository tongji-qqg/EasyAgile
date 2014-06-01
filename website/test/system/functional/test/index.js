// googletesting.js
// casper.test.begin('Google search retrieves 10 or more results', 3, function suite(test) {
//     casper.start("http://localhost:18080/login", function() {
//         test.assertTitle("EasyAgile--login", "Login page title is the one expected");
//         test.assertExists('form[action="/login"]', "login form is found");
//         this.fill('form[action="/login"]', {
//             emailaddress:"playwew@126.com",
//             password    :"whoami"
//         }, true);
//     });

//     casper.then(function() {
//         test.assertTitle("用户中心", "user main page title is ok");                
//     });

//     casper.run(function() {
//         test.done();
//     });
// });

var chai = require('chai');
var casper_chai = require('casper-chai');
chai.use(casper_chai);
var should = chai.should();
var HOSTPATH = 'http://localhost:18080/';

////////////////////////////////////////////////////

//---------specify index page function------------//

////////////////////////////////////////////////////


describe('Index page', function() {
  	before(function() {
    	casper.start(HOSTPATH);
  	})
    after(function(){
      //casper.clear();
    })
  	it('should be index page',function(){
  		casper.then(function(){
  			'Easy Agile'.should.matchTitle  
  			'bootstrap.min.css'.should.be.loaded		
  			'a[href="reg"]'.should.be.inDOM
  			'a[href="login"]'.should.be.inDOM  		
  		});
  	});
 

  	it('login link should work', function(){
  		casper.then(function(){
  			this.clickLabel('登陆', 'a');  	
  		});
  		casper.then(function(){
  			'Easy Agile - login'.should.matchTitle
  			this.back();
  		});
  	})
  	
  	it('register link should work', function(){
  		casper.then(function(){
  			'Easy Agile'.should.matchTitle
  			this.clickLabel('注册', 'a');  	
  		});	
  		casper.then(function(){
	  		'Easy Agile - Register'.should.matchTitle  		
	  	});
  	})  	 
})

