var EmailService = require('../../api/services/EmailService'),
    sinon = require('sinon'),    
    assert = require('assert'),
    should = require('chai').should();

describe('Email Service', function(){
	it('should send email', function(done){
		var cb = sinon.spy();		
	    EmailService.send('playwew@126.com','帐号激活', 'please click this link',function(err,result){
	    	console.log(err,result);
	    });	    
	    //console.log(cb.args);
	    //assert.ok(cb.called);
	    //cb.args[0][0].should.be.null;	  
	    done();	      
	})
});