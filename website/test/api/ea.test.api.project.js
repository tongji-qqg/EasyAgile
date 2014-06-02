var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');
var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var uid2= require('../setting.js').uid2;

function login(email, password){
  return function(done){
    browser
        .post('/API/u')
        .send({ emailaddress: email, password: password })
        .expect(302)        
        .end(function(err,res){
          res.body.state.should.equal('success');
          uid=res.body.user._id;
          url = '/user/'+uid;
          done();
        });
  }
}
function logout(){
  return function(done){
    browser.get('/API/logout')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){return done(err)});
  }
}

describe('Project API', function(){
  before(login('playwew@126.com','whoami'))
  after(logout())
  var newpid;
  describe('post    /API/p', function(){
    it('project should have info', function(done){
      browser.post('/API/p')
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){res.body.state.should.equal('error');return done(err)});
    });
    it('project should have name', function(done){
      browser.post('/API/p')
           .send({des:'test des'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){res.body.state.should.equal('error');return done(err)});
    });

    it('project should have description', function(done){
      browser.post('/API/p')
           .send({name:'test project'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){res.body.state.should.equal('error');return done(err)});
    });
    
    it('project can be created', function(done){
      browser.post('/API/p')
           .send({name:'test project',des:'test des'})
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.project.should.exist;
            newpid = res.body.project._id;
            return done(err)
          });
    });
  });                             
  
  describe('get     /API/p/:pid', function(){
    it('should respond with error', function(done){
      browser.get('/API/p/wrongpidxxxxxxxxxxxxxxxx')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('error');            
            return done(err)
          });
    });
    it('should respond with json', function(done){
      browser.get('/API/p/'+newpid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');
            res.body.project._id.should.equal(newpid);
            res.body.project.name.should.equal('test project');
            return done(err)
          });
    });
  });                        
  
  describe('put     /API/p/:pid', function(){
    it('should respond with error', function(done){
      browser.put('/API/p/wrongpidxxxxxxxxxxxxxxxx')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('error');            
            return done(err)
          });
    });
    it('should sueecss with nothing', function(done){
      browser.put('/API/p/'+newpid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });
    });
    it('should sueecss with name', function(done){
      browser.put('/API/p/'+newpid)  
           .send({name:'new project'})         
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });
    });
    it('should sueecss with des', function(done){
      browser.put('/API/p/'+newpid)  
           .send({des:'my project des'})         
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });
    });
    it('should sueecss with endtime', function(done){
      browser.put('/API/p/'+newpid)  
           .send({endTime:'2015-1-1'})         
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');            
            return done(err)
          });
    });
  });     

  
  describe('put     /API/pf/:pid', function(){
    it('should respond with error', function(done){
      browser.put('/API/pf/wrongpidxxxxxxxxxxxxxxxx')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('error');            
            return done(err)
          });
    });
    it('can be finished', function(done){
      browser.put('/API/pf/'+newpid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            return done(err)
          });
    });
  });                       
  
  describe('put     /API/ps/:pid', function(){
    it('should respond with error', function(done){
      browser.put('/API/ps/wrongpidxxxxxxxxxxxxxxxx')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('error');            
            return done(err)
          });
    });
    it('can be restart', function(done){
      browser.put('/API/ps/'+newpid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            return done(err)
          });
    });
  });


  
  describe('post    /API/p/:pid/mid/:uid', function(){
    it('should respond with error', function(done){
      browser.post('/API/p/'+newpid+'/mid/000000000000000000000000')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('error');
            return done(err)
          });
    });
    it('should respond with json', function(done){
      browser.post('/API/p/'+newpid+'/mid/'+uid2)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            return done(err)
          });
    });
  });               
  
  describe('get     /API/p/:pid/inviteById/reject', function(){
    it('logout first', logout());
    it('user 2 login', login('QQG1234567@163.com','whoami'));
    it('should can reject this project', function(done){
      browser.get('/API/p/'+newpid+'/inviteById/reject')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){   
            res.body.state.should.equal('success');         
            return done(err)
          });
    });
    it('user2 logout', logout());
    it('user1 login', login('playwew@126.com','whoami'));
    it('send invite again should respond with json', function(done){
      browser.post('/API/p/'+newpid+'/mid/'+uid2)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){
            res.body.state.should.equal('success');
            return done(err)
          });
    });
  });

  describe('get     /API/p/:pid/inviteById/accept', function(){
    it('logout first', logout());
    it('user 2 login', login('QQG1234567@163.com','whoami'));
    it('should can accept this project', function(done){
      browser.get('/API/p/'+newpid+'/inviteById/accept')           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){   
            res.body.state.should.equal('success');         
            return done(err)
          });
    });
    it('user2 logout', logout());
    it('user1 login', login('playwew@126.com','whoami'));
  });      
  
  describe('post    /API/p/:pid/me/:email', function(){
    it('invalid email shall return error',function(done){
      browser.post('/API/p/'+newpid+'/me/wrongEmail@1')           
           .expect(200)
           .expect('Content-Type', /json/)          
           .expect({state: "error", errorNumber: 26, message: 'email format error'})
           .end(function(err, res){return done(err) });
    });
    it('real invite should be test manually')
  });              
  

  describe('put     /API/p/:pid/ma/:uid', function(){
    it('can set member to admin', function(done){
      browser.put('/API/p/'+newpid+'/ma/'+uid2)           
           .expect(200)
           .expect('Content-Type', /json/)          
           .expect({state: "success", errorNumber: 0})
           .end(function(err, res){return done(err) });
    });
  });                
  
  describe('delete  /API/p/:pid/ma/:uid', function(){
    it('can set member to normal', function(done){
      browser.delete('/API/p/'+newpid+'/ma/'+uid2)           
           .expect(200)
           .expect('Content-Type', /json/)          
           .expect({state: "success", errorNumber: 0})
           .end(function(err, res){return done(err) });
    });
  });                
  
  describe('post    /API/p/:pid/g', function(){
    it('can add new group', function(done){
      browser.post('/API/p/'+newpid+'/g')
           .send({group:'test'})           
           .expect(200)
           .expect('Content-Type', /json/)          
           .expect({state: "success", errorNumber: 0})
           .end(function(err, res){return done(err) });
    });
  });  

  describe('put     /API/p/:pid/mg/:uid' , function(){
    it('can set member to group', function(done){
      browser.put('/API/p/'+newpid+'/mg/'+uid2)
           .send({group:'test'})           
           .expect(200)
           .expect('Content-Type', /json/)          
           .expect({state: "success", errorNumber: 0})
           .end(function(err, res){return done(err) });
    });
  });               
  
                      
  
  describe('delete  /API/p/:pid/g', function(){
    it('can delete group', function(done){
      browser.delete('/API/p/'+newpid+'/g')
           .send({group:'test'})           
           .expect(200)
           .expect('Content-Type', /json/)          
           .expect({state: "success", errorNumber: 0})
           .end(function(err, res){return done(err) });
    });
  });                      
  
  describe('delete  /API/p/:pid/mid/:uid', function(){
    it('should test manually',function(done){
      browser.delete('/API/p/'+newpid+'/mid/'+uid2)           
           .expect(200)
           .expect('Content-Type', /json/)          
           .expect({state: "success", errorNumber: 0})
           .end(function(err, res){return done(err) });
    });
  });               
  
  describe('get     /API/p/:pid/h', function(){
    it('should respond with project historys',function(done){
      browser.get('/API/p/'+newpid+'/h')              
           .expect(200)
           .expect('Content-Type', /json/)                     
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.historys.should.exist;            
            return done(err)
            });
    });
  });                      
  
  describe('get     /API/p/:pid/h/:from/:to', function(){
    it('should respond with project historys',function(done){
      browser.get('/API/p/'+newpid+'/h/0/1')              
           .expect(200)
           .expect('Content-Type', /json/)                     
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.historys.should.exist;            
            return done(err)
            });
    });
  });            
  
  describe('get     /API/p/:pid/members' , function(){
    it('should respond with json',function(done){
      browser.get('/API/p/'+newpid+'/members')              
           .expect(200)
           .expect('Content-Type', /json/)                     
           .end(function(err, res){
            res.body.state.should.equal('success');
            res.body.members.should.exist;
            res.body.members.owner.should.exist;
            res.body.members.members.should.exist;
            res.body.members.groups.should.exist;           
            return done(err)
            });
    });
  });               
  
  describe('get     /API/p/:pid/inviteByEmail/:email/token/:token/accept', function(){
    it('should test manually');
  });
  
  describe('get     /API/p/:pid/inviteByEmail/:email/token/:token/reject', function(){
    it('should test manually');
  });
  
  describe('get     /API/reg/p/:pid/inviteByEmail/:email/token/:token'   , function(){
    it('should test manually');
  });
  
  describe('post    /API/invite/register', function(){
    it('should test manually');
  });               

  describe('delete  /API/p/:pid', function(){
    it('can be deleted', function(done){      
      browser.del('/API/p/'+newpid)           
           .expect(200)
           .expect('Content-Type', /json/)             
           .end(function(err, res){            
            res.body.state.should.equal('success');
            return done(err)
          });
    });
  }); 

})
