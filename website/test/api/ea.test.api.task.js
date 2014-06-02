var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var sid = require('../setting.js').sid;
function login(email, password){
  return function(done){
    browser
        .post('/API/u')
        .send({ emailaddress: email, password: password })
        .expect(302)        
        .end(function(err,res){
          res.body.state.should.equal('success');
          done();
        });
  }
}
function logout(){
  return function(done){
    browser.get('/API/logout')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){res.body.state.should.equal('success');return done(err)});
  }
}

describe('Task API', function(){

  before(login('playwew@126.com','whoami'))
  after(logout());

  var newtid;
  describe('post    /API/p/:pid/s/:sid/t', function(){
    it('missinfo cannot create task', function(done){
      browser.post('/API/p/'+pid+'/s/'+sid+'/t')                 
           .expect(200)
           .expect('Content-Type', /json/)                     
           .end(function(err, res){res.body.state.should.equal('error');return done(err) });
    });
    it('have title can create task', function(done){
      browser.post('/API/p/'+pid+'/s/'+sid+'/t')                 
           .send({'title':'task'})
           .expect(200)
           .expect('Content-Type', /json/)                    
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.task.should.exist;
            newtid = res.body.task._id;
            return done(err) 
          });
    });
  });      

  describe('get     /API/p/:pid/s/:sid/t', function(){
    it('can get all task in sprint', function(done){
      browser.get('/API/p/'+pid+'/s/'+sid+'/t')                            
           .expect(200)
           .expect('Content-Type', /json/)                    
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.tasks.should.exist;            
            return done(err) 
          });
    });
  });               
             
  function userCanChangeTask(change){
    return function(done){
        browser.put('/API/p/'+pid+'/s/'+sid+'/t/'+newtid)                 
             .send(change)
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
        }
  }
  
  describe('put /API/p/:pid/s/:sid/t/:tid', function(){
    it('change nothing not error', userCanChangeTask({}));
    it('user can change task title',userCanChangeTask({title:'new title'}));
    it('user can change task des',userCanChangeTask({description:'new des'}));
    it('user can change task startTime',userCanChangeTask({startTime:'2014-6-1'}));
    it('user can change task deadline',userCanChangeTask({deadline:'2014-6-30'}));
    it('user can change task estimate',userCanChangeTask({estimate:3}));
  });          
  
  describe('put     /API/p/:pid/s/:sid/t/:tid/progress', function(){
    it('should respond with json',function(done){
      browser.put('/API/p/'+pid+'/s/'+sid+'/t/'+newtid+'/progress')                 
             .send({progress:20})
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });      
    });
  }); 
  
  var newbid;

  
  describe('put     /API/p/:pid/s/:sid/t/:tid/b/:bid', function(){
    it('should create backlog success',function(done){
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
    it('should respond with success',function(done){
      browser.put('/API/p/'+pid+'/s/'+sid+'/t/'+newtid+'/b/'+newbid)                              
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
    });
  });
  describe('put     /API/p/:pid/s/:sid/t/:tid/nob', function(){
    it('should respond with success',function(done){
      browser.put('/API/p/'+pid+'/s/'+sid+'/t/'+newtid+'/nob/')
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
    });
    it('should delete temp backlog', function(done){
      browser.del('/API/p/'+pid+'/s/'+sid+'/b/'+newbid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err,res){
            res.body.state.should.equal('success'); 
            done();           
           })
    });
  });      
  
  describe('put     /API/p/:pid/s/:sid/t/:tid/u/:uid', function(){
    it('should respond with json', function(done){
      browser.put('/API/p/'+pid+'/s/'+sid+'/t/'+newtid+'/u/'+uid)
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
    });
  });   
  
  describe('delete  /API/p/:pid/s/:sid/t/:tid/u/:uid', function(){
    it('should respond with json', function(done){
      browser.del('/API/p/'+pid+'/s/'+sid+'/t/'+newtid+'/u/'+uid)
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
    });
  });   
  
  describe('delete  /API/p/:pid/s/:sid/t/:tid/ua', function(){
    it('should respond with json',function(done){
      browser.del('/API/p/'+pid+'/s/'+sid+'/t/'+newtid+'/ua/')
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
    });
  });       
  
  describe('get     /API/p/:pid/s/:sid/t/:tid/h', function(){
    it('should respond with json',function(done){
      browser.get('/API/p/'+pid+'/s/'+sid+'/t/'+newtid+'/h')
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
    });
  }); 

  describe('delete  /API/p/:pid/s/:sid/t/:tid', function(){

    it('should respond with json',function(done){
      browser.del('/API/p/'+pid+'/s/'+sid+'/t/'+newtid)
             .expect(200)
             .expect('Content-Type', /json/)                    
             .end(function(err, res){
              res.body.state.should.equal('success');                      
              return done(err) 
            });
    });
  });
});  