var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var tid = require('../setting.js').topicid;

describe('Topic API', function(){
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
  //////////////////////////////////////////////////////////////////////////////
  describe('get    /API/p/:pid/t', function(){
  	it('should respond all topic in json', function(done){
      browser.get('/API/p/'+pid+'/t')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.topics.should.exist;
            return done(err)
          });  
    });
    it('should respond error when params wrong', function(done){
      browser.get('/API/p/000/t')
           .expect(200)
           .expect('Content-Type', /json/)             
           .expect({ state: 'error', errorNumber: 29, message: 'parameter in url not valid' })
           .end(function(err, res){            
            return done(err)
          });  
    });
  });                       
  
  describe('get    /API/p/:pid/t/:tid', function(){
  	it('should respond one topic int json', function(done){
      browser.get('/API/p/'+pid+'/t/'+tid)
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.topic.should.exist;
            return done(err)
          });  
    });
    it('should respond error topic when not find', function(done){
      browser.get('/API/p/'+pid+'/t/111111111111111111111111')
           .expect(200)
           .expect('Content-Type', /json/)
           .expect({ state: 'error', errorNumber: 9, message: 'topic not find!' })             
           .end(function(err, res){return done(err) });
    });
  });                  
  var newtid;
  describe('post   /API/p/:pid/t', function(){
  	it('not specifiy title should respond error', function(done){
      browser.post('/API/p/'+pid+'/t')
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){res.body.state.should.equal('error');return done(err) });
    });
    it('specifiy title should respond success', function(done){
      browser.post('/API/p/'+pid+'/t')
           .send({title:'test topic'})
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.topic.should.exist;
            newtid = res.body.topic._id;
            return done(err) 
          });
    });
  });                       
  
  
  var newcid;
  describe('post   /API/p/:pid/tc/:tid', function(){
  	it('no message should respond with error', function(done){
      browser.post('/API/p/'+pid+'/tc/'+newtid)           
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){res.body.state.should.equal('error');return done(err) });
    });
    it('have message should respond with success', function(done){
      browser.post('/API/p/'+pid+'/tc/'+newtid)           
           .send({comment:'test comment'})
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.comment.should.exist;
            newcid = res.body.comment._id;            
            return done(err) 
          });
    });
  });                 
  
  describe('get    /API/p/:pid/tc/:tid', function(){
  	it('should respond with all comment of a topic', function(done){
      browser.get('/API/p/'+pid+'/tc/'+newtid)                      
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){
              res.body.state.should.equal('success');
              res.body.comments.should.exist
              return done(err) 
            });
    });
  });                 
  
  describe('delete /API/p/:pid/t/:tid/c/:cid', function(){
  	it('should respond with json', function(done){
       browser.del('/API/p/'+pid+'/t/'+tid+'/c/000000000000000000000000')                      
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){
              res.body.state.should.equal('error');              
              return done(err) 
            });
    });
    it('should respond with json', function(done){
       browser.del('/API/p/'+pid+'/t/'+newtid+'/c/'+newcid)                      
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){
              res.body.state.should.equal('success');              
              return done(err) 
            });
    });
  });
  describe('delete /API/p/:pid/t/:tid', function(){
    it('wrong params should respond error', function(done){
      browser.del('/API/p/'+pid+'/t/111111111111111111111111')           
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){res.body.state.should.equal('error');return done(err) });
    });
    it('can delete topic ', function(done){
      browser.del('/API/p/'+pid+'/t/'+newtid)           
           .expect(200)
           .expect('Content-Type', /json/)        
           .end(function(err, res){res.body.state.should.equal('success');return done(err) });
    })
  });                           
});