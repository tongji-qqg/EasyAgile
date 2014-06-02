var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var tid = require('../setting.js').taskid;

describe('Message API', function(){
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
  describe('get  /API/m', function(){
    it('should respond with use message', function(done){
      browser.get('/API/m')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.messages.should.exist;
            return done(err);
          });  
    });
  })                               
/* this function not used now, and it will create lots garbage  
  describe('post /API/m/u/:uid', function(){
    it('should send message to specifiy user', function(done){
      browser.post('/API/m/u/'+uid)
           .expect(200)
           .send({message:'test message'})
           .expect('Content-Type', /json/)             
           .expect({ state: 'success', errorNumber: 0 })
           .end(function(err, res){                      
            return done(err);
          });
    });
  })                         
*/  
  describe('get  /API/ma', function(){
    it('should respond with all use message', function(done){
      browser.get('/API/ma')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.messages.should.exist;
            return done(err);
          });  
    });
  })                               
  
  //this function is not implemently currently
  describe('put  /API/m/:mid', function(){
    it('should respond with json',function(done){
      browser.put('/API/m/000000000000000000000000')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('error');            
            return done(err);
          });  
    });
  })                           
  
  describe('get  /API/a' , function(){
    it('should respond with user alert', function(done){
      browser.get('/API/a')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.alert.should.exist;            
            return done(err);
          }); 
    });
  })                               
  
  describe('get  /API/aa', function(){
    it('should respond with all user alert', function(done){
      browser.get('/API/aa')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.alert.should.exist;            
            return done(err);
          }); 
    });
  })                               
  
  describe('put  /API/a/:aid', function(){
    it('should respond error', function(done){
      browser.put('/API/a/000000000000000000000000')
           .expect(200)
           .expect('Content-Type', /json/)             
           .expect({ state: 'error', errorNumber: 14, message: 'not find!' })
           .end(function(err, res){return done(err); });
    });
  })                           
  
  describe('delete  /API/a/:aid', function(){
    it('should respond error', function(done){
      browser.del('/API/a/000000000000000000000000')
           .expect(200)
           .expect('Content-Type', /json/)             
           .expect({ state: 'error', errorNumber: 14, message: 'not find!' })
           .end(function(err, res){return done(err); });
    });
  })                        
  
  describe('delete  /API/a', function(){
     it('should respond success',function(done){
      browser.del('/API/a')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');            
            return done(err);
          });  
    });
  })  
})    