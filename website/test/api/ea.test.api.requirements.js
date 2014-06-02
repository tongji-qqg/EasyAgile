var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;

describe('Requirement API', function(){
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
  describe('get     /API/p/:pid/r', function(){
  	it('should respond with all project requirements', function(done){
      browser.get('/API/p/'+pid+'/r')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.requirements.should.exist;
            return done(err)
           });
    });
  });                      
                  
  var newrid;
  describe('post    /API/p/:pid/r', function(){
  	it('should respond error miss des', function(done){
      browser.post('/API/p/'+pid+'/r')
           .expect(200)
           .expect('Content-Type', /json/)             
           .expect({state:'error',errorNumber: 35, message: 'miss info'})
           .end(function(err, res){return done(err) });
    });
    it('should respond success have des', function(done){
      browser.post('/API/p/'+pid+'/r')
           .send({description:'test des'})
           .expect(200)
           .expect('Content-Type', /json/)                        
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.requirement.should.exist;
            newrid = res.body.requirement._id;
            return done(err) 
          });
    });    
  });                      
  
  describe('put     /API/p/:pid/r/:rid', function(){
  	it('should respond error when params error', function(done){
      browser.put('/API/p/'+pid+'/r/111111111111111111111111')           
           .expect(200)
           .expect('Content-Type', /json/)                        
           .end(function(err, res){res.body.state.should.equal('error');return done(err) });
    });
    it('can edit one requirement', function(done){
      browser.put('/API/p/'+pid+'/r/'+newrid)
           .send({'description':'hw'})           
           .expect(200)
           .expect('Content-Type', /json/)                        
           .end(function(err, res){res.body.state.should.equal('success');return done(err) });
    });
  });                 
  
  describe('delete  /API/p/:pid/r/:rid', function(){
  	it('should respond with json',function(done){
      browser.del('/API/p/'+pid+'/r/000000000000000000000000')           
           .expect(200)
           .expect('Content-Type', /json/)                        
           .end(function(err, res){res.body.state.should.equal('error');return done(err) });
    });
    it('should respond with json',function(done){
      browser.del('/API/p/'+pid+'/r/'+newrid)           
           .expect(200)
           .expect('Content-Type', /json/)                        
           .end(function(err, res){res.body.state.should.equal('success');return done(err) });
    });
  });

  describe('delete  /API/p/:pid/r', function(){
    it('should respond with json',function(done){
      browser.del('/API/p/'+pid+'/r')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .expect({state:'success',errorNumber: 0})
           .end(function(err, res){return done(err) });
    });
  });                  
})  