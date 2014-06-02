var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var sid = require('../setting.js').sid;

describe('Sprint API', function(){
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

  describe('get    /API/p/:pid/s', function(){
    it('wrong params should respond error', function(done){
      browser.get('/API/p/000000000000000000000000/s')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('error');            
            return done(err)
          });  
    });
  	it('should respond with all sprint info of project', function(done){
      browser.get('/API/p/'+pid+'/s')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');
            res.body.sprints.should.exist;
            return done(err)
          });  
    });
  });                       
  
  describe('get    /API/p/:pid/s/:sid', function(){
    it('wrong params should respond error', function(done){
      browser.get('/API/p/000000000000000000000000/s/'+sid)
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){    
           console.log(res.body);        
            res.body.state.should.equal('error');           
            return done(err)
          });  
    });
  	it('should respond with sprint info', function(done){
      browser.get('/API/p/'+pid+'/s/'+sid)
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');
            res.body.sprint.should.exist;
            return done(err)
          });  
    });
  });                  
  var newsid;
  describe('post   /API/p/:pid/s', function(){
    it('miss info should error', function(done){
      browser.post('/API/p/'+pid+'/s')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('error');
            return done(err)
          });  
    });
  	it('all info should success', function(done){
      browser.post('/API/p/'+pid+'/s')
           .send({'name':'sprint','description':'des'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');
            res.body.sprint.should.exist;
            newsid = res.body.sprint._id;
            return done(err)
          });  
    });
  });                       
  
  
  describe('put    /API/p/:pid/s/:sid', function(){
  	it('should respond with success', function(done){
      browser.put('/API/p/'+pid+'/s/'+newsid)
           .send({'name':'sprint2','description':'des2'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){                     
            res.body.state.should.equal('success');            
            return done(err)
          });  
    });
  });                  
  

        
      

  describe('get    /API/p/:pid/s/:sid/start', function(){
  	it('should respond with json',function(done){
      browser.get('/API/p/'+pid+'/s/'+newsid+'/start')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });  
    });
  });              
  
  describe('get    /API/p/:pid/s/:sid/finish', function(){
  	it('should respond with json',function(done){
      browser.get('/API/p/'+pid+'/s/'+newsid+'/finish')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });  
    });
  });           
  
  describe('get    /API/p/:pid/s/:sid/h', function(){
  	it('should respond with json',function(done){
      browser.get('/API/p/'+pid+'/s/'+newsid+'/h')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });  
    });
  });

  describe('delete /API/p/:pid/s/:sid', function(){
    it('current sprint cannot delete', function(done){
      browser.del('/API/p/'+pid+'/s/'+newsid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){          
            res.body.state.should.equal('error');            
            return done(err)
          });  
    });
    it('should respond with json',function(done){
      browser.get('/API/p/'+pid+'/s/'+sid+'/start')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });  
    });
    it('non current sprint can delete', function(done){
      browser.del('/API/p/'+pid+'/s/'+newsid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){         
            res.body.state.should.equal('success');            
            return done(err)
          });  
    });
  });    
})