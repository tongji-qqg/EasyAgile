var StaticController = require('../../api/controllers/StaticController'),
    sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert');
var browser = supertest.agent('http://localhost:18080');

var uid = require('../setting.js').uid;
var pid = require('../setting.js').pid;
var tid = require('../setting.js').topicid;
var wrongPid1 = wrongUid1 = wrongTid1= '000000000000000000000000';
var wrongPid2 = wrongUid2 = wrongTid2= '00000000000000000000000';

function shouldRenderTheView(method, view){
  return function(){
    var cb = sinon.spy();
    StaticController[method]({session:{}}, {view: cb});
    assert.ok(cb.called);
    assert.equal(view, cb.args[0][0], view);    
  }
}

function userCanGetPage(url){
  return function(done){
    browser.get(url)
           .expect(200)
           .end(function(err,res){
              res.type.should.equal('text/html');
              res.redirect.should.equal(false);
              done(err);
            })
  }
}
function userCannotGetPage(url){
  return function(done){
    browser.get(url)
           .expect(200)
           .expect('Content-Type', /json/)
           .end(function(err,res){              
              res.body.state.should.equal('error')
              done(err);
            })
  }
}

describe('Static API', function(){
  after(function(done){
    browser.get('/API/logout')
             .expect(200)
             .expect('Content-Type', /json/)             
             .end(function(err, res){return done(err)});
  })
  describe('get /', function(){
    it('should render the view index', shouldRenderTheView('index', 'index'));
    it ('client can get "/"', function (done) {
      browser.get('/') .expect(200)
             .end(function(err,res){done(err);})
    })
  })                                      
  describe('get /mobile', function(){
    it('should render the view mobile', shouldRenderTheView('mobile', 'mobile'));
    it ('client can get "/mobile"', function (done) {
      browser.get('/mobile') .expect(200)
             .end(function(err,res){done(err);})
    })
  })


  describe('get /reg', function(){
    it('should render the view auth/signup', shouldRenderTheView('reg', 'auth/signup'));
    it ('client can get "/reg"', function (done) {
      browser.get('/reg') .expect(200)
             .end(function(err,res){done(err);})
    })
  })                                   
  describe('get /login', function(){
    it('should render the view auth/login', shouldRenderTheView('login','auth/login'));
    it ('client can get "/login"', function (done) {
      browser.get('/login') .expect(200)
             .end(function(err,res){done(err);})
    })
  })                            

  
  describe('get /user/:uid', function(){

    it('user login by API', function(done){
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
    
    it ('user can get home page "/user/'+ uid + '"', userCanGetPage('/user/'+uid))
    it ('user cannot get wrong url "/user/'+ wrongUid2 + '"', userCannotGetPage('/user/'+wrongUid2))
  })                             

  describe('get /user_task/:uid', function(){
    it ('user can get page "/user_task/'+ uid + '"', userCanGetPage('/user_task/'+uid))
    it ('user cannot get wrong url "/user_task/'+ wrongUid2 + '"', userCannotGetPage('/user_task/'+wrongUid2))
  })                        

  describe('get /user_cal/:uid', function(){
    it ('user can get page "/user_cal/'+ uid + '"', userCanGetPage('/user_cal/'+uid))
    it ('user cannot get wrong url "/user_cal/'+ wrongUid2 + '"', userCannotGetPage('/user_cal/'+wrongUid2))
  })                         

  describe('get /user_message/:uid', function(){
    it ('user can get page "/user_message/'+ uid + '"', userCanGetPage('/user_message/'+uid))
    it ('user cannot get wrong url "/user_message/'+ wrongUid2 + '"', userCannotGetPage('/user_message/'+wrongUid2))
  })                     

  describe('get /project/:pid', function(){    
    it ('user can get page "/project/'+ pid + '"', userCanGetPage('/project/'+pid))
    it ('user cannot get wrong url "/project/'+ wrongPid1 + '"', userCannotGetPage('/project/'+wrongPid1))
    it ('user cannot get wrong url "/project/'+ wrongPid2 + '"', userCannotGetPage('/project/'+wrongPid2))
  })
                            
  describe('get /project_taskboard/:pid', function(){
    it ('user can get page "/project_taskboard/'+ pid + '"', userCanGetPage('/project_taskboard/'+pid))
    it ('user cannot get wrong url "/project_taskboard/'+ wrongPid1 + '"', userCannotGetPage('/project_taskboard/'+wrongPid1))
    it ('user cannot get wrong url "/project_taskboard/'+ wrongPid2 + '"', userCannotGetPage('/project_taskboard/'+wrongPid2))
  })
                  
  describe('get /project_cal/:pid', function(){
    it ('user can get page "/project_cal/'+ pid + '"', userCanGetPage('/project_cal/'+pid))
    it ('user cannot get wrong url "/project_cal/'+ wrongPid1 + '"', userCannotGetPage('/project_cal/'+wrongPid1))
    it ('user cannot get wrong url "/project_cal/'+ wrongPid2 + '"', userCannotGetPage('/project_cal/'+wrongPid2))
  })
                        
  describe('get /project_issue/:pid', function(){
    it ('user can get page "/project_issue/'+ pid + '"', userCanGetPage('/project_issue/'+pid))
    it ('user cannot get wrong url "/project_issue/'+ wrongPid1 + '"', userCannotGetPage('/project_issue/'+wrongPid1))
    it ('user cannot get wrong url "/project_issue/'+ wrongPid2 + '"', userCannotGetPage('/project_issue/'+wrongPid2))
  })
                      
  describe('get /project_files/:pid', function(){
    it ('user can get page "/project_files/'+ pid + '"', userCanGetPage('/project_files/'+pid))
    it ('user cannot get wrong url "/project_files/'+ wrongPid1 + '"', userCannotGetPage('/project_files/'+wrongPid1))
    it ('user cannot get wrong url "/project_files/'+ wrongPid2 + '"', userCannotGetPage('/project_files/'+wrongPid2))
  })
                      
  describe('get /project_topic/:pid', function(){
    it ('user can get page "/project_topic/'+ pid + '"', userCanGetPage('/project_topic/'+pid))
    it ('user cannot get wrong url "/project_topic/'+ wrongPid1 + '"', userCannotGetPage('/project_topic/'+wrongPid1))
    it ('user cannot get wrong url "/project_topic/'+ wrongPid2 + '"', userCannotGetPage('/project_topic/'+wrongPid2))
  })
                      
  describe('get /project_editor/:pid', function(){
    it ('user can get page "/project_editor/'+ pid + '"', userCanGetPage('/project_editor/'+pid))
    it ('user cannot get wrong url "/project_editor/'+ wrongPid1 + '"', userCannotGetPage('/project_editor/'+wrongPid1))
    it ('user cannot get wrong url "/project_editor/'+ wrongPid2 + '"', userCannotGetPage('/project_editor/'+wrongPid2))
  })
                     
  describe('get /project_members/:pid', function(){
    it ('user can get page "/project_members/'+ pid + '"', userCanGetPage('/project_members/'+pid))
    it ('user cannot get wrong url "/project_members/'+ wrongPid1 + '"', userCannotGetPage('/project_members/'+wrongPid1))
    it ('user cannot get wrong url "/project_members/'+ wrongPid2 + '"', userCannotGetPage('/project_members/'+wrongPid2))
  })
                    
  describe('get /project_newTopic/:pid', function(){
    it ('user can get page "/project_newTopic/'+ pid + '"', userCanGetPage('/project_newTopic/'+pid))
    it ('user cannot get wrong url "/project_newTopic/'+ wrongPid1 + '"', userCannotGetPage('/project_newTopic/'+wrongPid1))
    it ('user cannot get wrong url "/project_newTopic/'+ wrongPid2 + '"', userCannotGetPage('/project_newTopic/'+wrongPid2))
  })
                   
  describe('get /project_oneTopic/:pid/t/:tid', function(){
    it ('user can get page "/project_oneTopic/'+ pid + '/t/'+tid+'"', userCanGetPage('/project_oneTopic/'+pid+'/t/'+tid))
    it ('user cannot get wrong url "/project_oneTopic/'+ wrongPid1 + '/t/'+wrongTid1+'"', userCannotGetPage('/project_oneTopic/'+wrongPid1+'/t/'+wrongTid1))
    it ('user cannot get wrong url "/project_oneTopic/'+ wrongPid2 + '/t/'+wrongTid2+'"', userCannotGetPage('/project_oneTopic/'+wrongPid2+'/t/'+wrongTid2))
   
  })
}); 