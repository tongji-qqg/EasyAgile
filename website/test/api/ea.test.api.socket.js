var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var sid = require('../setting.js').sid;

describe('Socket API', function(){
  before(function(done){
    browser
        .post('/API/u')
        .send({ emailaddress: 'playwew@126.com', password: 'whoami' })
        .expect(302)        
        .end(function(err,res){
          res.body.state.should.equal('success');
          uid=res.body.user._id;
          url = '/user/'+uid;
          done();
        });
  })
  after(function(done){
    browser.get('/API/logout')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){return done(err)});
  })


  describe('get     /API/u/:uid/sub', function(){
  	it('should respond with json', function(done){
  		browser.get('/API/u/'+uid+'/sub')
           .expect(200)
           .expect('Content-Type', /json/)
           .expect({ state: 'success', errorNumber: 0, message: 'Subscribe only open to Socket' }) 
           .end(function(err, res){return done(err)});
  	});
  });                    

  describe('get     /API/p/:pid/sub', function(){
  	it('should respond with json', function(done){
  		browser.get('/API/p/'+pid+'/sub')
           .expect(200)
           .expect('Content-Type', /json/)
           .expect({ state: 'success', errorNumber: 0, message: 'Subscribe only open to Socket' }) 
           .end(function(err, res){return done(err)});
  	});
  });                    

  describe('get     /API/p/:pid/s/:sid/sub', function(){
  	it('should respond with json', function(done){
  		browser.get('/API/p/'+pid+'/s/'+sid+'/sub')
           .expect(200)
           .expect('Content-Type', /json/)
           .expect({ state: 'success', errorNumber: 0, message: 'Subscribe only open to Socket' }) 
           .end(function(err, res){return done(err)});
  	});
  });       
})