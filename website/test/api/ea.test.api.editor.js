var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;

describe('Editor API', function(){
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

  describe('get     /API/p/:pid/e', function(){
    it('should respond with all project editors', function(done){
      browser.get('/API/p/'+pid+'/e')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.editor.should.exist;
            return done(err)
           });
    });
  })                      
  var neweid;
  describe('post    /API/p/:pid/e', function(){
    it('should respond with json', function(done){
      browser.post('/API/p/'+pid+'/e')
           .send({name:'test editor'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.file.should.exist;
            neweid = res.body.file._id;
            return done(err)
           });
    });
  }) 
                   
  describe('delete  /API/p/:pid/e/:eid', function(){
    it('should respond with error if eid wrong',function(done){
      browser.del('/API/p/'+pid+'/e/000000000000000000000000')           
           .expect(200)
           .expect('Content-Type', /json/)                        
           .end(function(err, res){res.body.state.should.equal('error');return done(err) });
    });
    it('should respond with success',function(done){
      browser.del('/API/p/'+pid+'/e/'+neweid)           
           .expect(200)
           .expect('Content-Type', /json/)                        
           .end(function(err, res){res.body.state.should.equal('success');return done(err) });
    });
  })        
})
