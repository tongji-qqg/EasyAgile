var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;

describe('Backlog API', function(){
  var sid;
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
  
///////////////////////////////////////////////////////////////////////////
  describe('get     /API/p/:pid/s/:sid/b', function(){    
    it('get sid first',function(done){
      browser.get('/API/p/'+pid)
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){
            sid = res.body.project.cSprint;            
            done();
           })
    })
    it('should respond return all sprint backlog',function(done){
      browser.get('/API/p/'+pid+'/s/'+sid+'/b')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){            
            res.body.state.should.equal('success');
            res.body.backlog.should.exist;
            done();
           })
    });
  })
  var newbid;
  
  describe('post    /API/p/:pid/s/:sid/b' , function(){
    it('should error without info',function(done){
      browser.post('/API/p/'+pid+'/s/'+sid+'/b')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){            
            res.body.state.should.equal('error');            
            done();
           })
    });
    it('should success with title',function(done){
      browser.post('/API/p/'+pid+'/s/'+sid+'/b')
           .send({title:'backlog test'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){            
            res.body.state.should.equal('success');            
            res.body.backlog.should.exist;
            newbid = res.body.backlog._id;
            done();
           })
    });
  })

  describe('put     /API/p/:pid/s/:sid/b/:bid', function(){
    it('no title respond error', function(done){
      browser.put('/API/p/'+pid+'/s/'+sid+'/b/'+newbid)
           .send({})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){
            res.body.state.should.equal('error'); 
            done();           
           })
    });
    it('should respond with json', function(done){
      browser.put('/API/p/'+pid+'/s/'+sid+'/b/'+newbid)
           .send({title:'test'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){
            res.body.state.should.equal('success'); 
            done();           
           })
    });
  })

           
  describe('delete  /API/p/:pid/s/:sid/b/:bid' , function(){
    it('should respond with json', function(done){
      browser.del('/API/p/'+pid+'/s/'+sid+'/b/'+newbid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){
            res.body.state.should.equal('success'); 
            done();           
           })
    });
  })

  describe('delete  /API/p/:pid/s/:sid/b', function(){
    it('should respond with json',function(done){
      browser.del('/API/p/'+pid+'/s/'+sid+'/b')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){
            res.body.state.should.equal('success'); 
            done();           
           })
    });
  })
});