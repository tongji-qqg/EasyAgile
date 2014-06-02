var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert');
var browser = supertest.agent('http://localhost:18080');

describe('Auth API', function(){

  describe('post /login', function(){
    var cookie;
    it('user can login', function(done){
      browser.post('/login')
       .send({emailaddress:'playwew@126.com',password:'whoami'})
       .expect(302)
       .expect('location','/user')
       .end(function(err, res){          
          if(err) return done(err);          
          //res.should.have.status(200);
          cookie = res.headers['set-cookie'];
          done();
       })
    });
  }) 
                     
  describe('post /reg', function(){
    it('should respond with json');
  })
                       
  describe('get  /logout', function(){
    it('should respond with json');
  })             
                    
  describe('get  /API/logout', function(){
    it('should respond with json');
  })         
                    
  describe('get  /auth/e/:email/t/:token', function(){
    it('should respond with json');
  })
});                  