var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;

describe('Files API', function(){
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

  describe('get      /API/p/:pid/f',function(){
    it('should respond with all project files', function(done){
      browser.get('/API/p/'+pid+'/f')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.files.should.exist;
            return done(err)
           });  
    });
    it('should respond error if pid wrong', function(done){
      browser.get('/API/p/000000000000000000000000/f')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('error');            
            return done(err)
           });  
    });
  });

  describe('post     /API/p/:pid/f',function(){
    it('should respond error miss file', function(done){
      browser.post('/API/p/'+pid+'/f')
           .expect(200)
           .expect('Content-Type', /json/)             
           .expect({ state: 'error', errorNumber: 28, message: 'file not find error' } )
           .end(function(err, res){return done(err) });
    });    
    it('real upload test should be manually')
  });

  describe('get      /API/p/:pid/f/:fid',function(){
    it('should respond error if fid wrong', function(done){
      browser.get('/API/p/'+pid+'/f/000000000000000000000000')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('error'); return done(err) });
    });
  });

  describe('delete   /API/p/:pid/f/:fid',function(){
    it('should respond error if fid wrong', function(done){
      browser.del('/API/p/'+pid+'/f/000000000000000000000000')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){ return done(err) });
    });
  });  
})
