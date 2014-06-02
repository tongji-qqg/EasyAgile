var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var tid = require('../setting.js').tid;


describe('User API', function(){
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
  ////////////////////////////////////////////////////////////////




  ////////////////////////////////////////////////////////////////
  describe('get  /API/u/name/:name', function(){
    it('should respond with json, and correct user',function(done){
      browser.get('/API/u/name/bryce')
             .expect(200)
             .expect('Content-Type', /json/)             
             .end(function(err, res){res.body.user[0].name.should.equal('bryce');return done(err)});
    });
    it('should respond with json and no user ',function(done){
      browser.get('/API/u/name/')
             .expect(200)
             .expect('Content-Type', /json/)              
             .end(function(err, res){should.not.exist(res.body.user);return done(err)});
    });
    it('should respond with json and no user ',function(done){
      browser.get('/API/u/name/xxxxxxxxxx')
             .expect(200)
             .expect('Content-Type', /json/)              
             .end(function(err, res){res.body.user.should.be.empty;return done(err)});
    });
  });                     

  describe('get  /API/u/email/:email', function(){
    it('should respond with json and bryce', function(done){
      browser.get('/API/u/email/playwew@126.com')
             .expect(200)
             .expect('Content-Type', /json/)             
             .end(function(err, res){res.body.user.name.should.equal('bryce');return done(err)});
    });
    it('should respond error when email not find', function(done){
      browser.get('/API/u/email/playwew@163.com')
             .expect(200)
             .expect('Content-Type', /json/)             
             .expect({ state: 'error', errorNumber: 6, message: 'user not find!'})
             .end(function(err, res){return done(err)});
    });
    it('should respond 404 when no email specified', function(done){
      browser.get('/API/u/email/')
             .expect(404)             
             .end(function(err, res){return done(err)});
    });
  });                   
  describe('get  /API/u', function(){
    it('should respond with use info json', function(done){
      browser.get('/API/u')
             .expect(200)             
             .end(function(err, res){
              res.body.user._id.should.equal(uid);
              res.body.user.name.should.equal('bryce');
              res.body.user.email.should.not.be.empty;              
              return done(err)});
    });
  });                                
  describe('post /API/u', function(){
    it('should respond error because already login', function(done){
      browser.post('/API/u')
             .send({ emailaddress: 'playwew@126.com', password: 'whoami' })
             .expect(200)  
             .expect({ state: 'error', errorNumber: 3, message: 'you are already login!' })
             .end(function(err, res){});
      browser.get('/API/logout')             
             .expect(200)   
             .expect({ state: 'success', errorNumber: 0 })            
             .end(function(err, res){return done()});
    });
    it('miss password info should respond error', function(done){
      browser.post('/API/u')
             .send({ emailaddress: 'playwew@126.com' })
             .expect(200)   
             .expect({ state: 'error', errorNumber: 35, message: 'miss info' })            
             .end(function(err, res){done()});
    })
    it('miss email info should respond error', function(done){
      browser.post('/API/u')
             .send({ password: 'whoami' })
             .expect(200)   
             .expect({ state: 'error', errorNumber: 35, message: 'miss info' })            
             .end(function(err, res){done()});
    })
    it('wrong email info should respond error', function(done){
      browser.post('/API/u')
             .send({ emailaddress:'playwew@163.com' ,password: 'whoami' })
             .expect({ state: 'error', errorNumber: 6, message: 'user not find!' })
             .expect(200)                
             .end(function(err, res){done()});
    })
    it('wrong password should respond error', function(done){
      browser.post('/API/u')
             .send({ emailaddress:'playwew@126.com' ,password: 'whoareyou' })
             .expect({ state: 'error', errorNumber: 4, message: 'password not ringht!' })
             .expect(200)                
             .end(function(err, res){});
      browser
        .post('/API/u')
        .send({ emailaddress: 'playwew@126.com', password: 'whoami' })
        .expect(302)        
        .end(function(err,res){
          res.body.state.should.equal('success');         
          done();
        });
    })
  });                                
  describe('put  /API/u', function(){
    it('user can change name', function(done){
      browser
        .put('/API/u')
        .send({  password: 'whoami' })
        .expect(302)        
        .end(function(err,res){
          res.body.state.should.equal('success');         
          done();
        });
    });
  });                                
  describe('put  /API/u/pw', function(){
    it('should respond with json');
  });                             
  describe('get  /API/u/ta', function(){
    it('should respond with json');
  });                             
  describe('get  /API/u/tc', function(){
    it('should respond with json');
  });                             
  describe('get  /API/u/projects', function(){
    it('should respond with json');
  });                       
  describe('put  /API/u/:uid/t/:tid', function(){
    it('should respond with json');
  });                    
  describe('post /API/u/:uid/icon', function(){
    it('should respond with json');
  });       
});