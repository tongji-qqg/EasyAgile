var sinon = require('sinon'),
    supertest = require("supertest"),
    assert = require('assert'),
    should = require('chai').should();
var browser = supertest.agent('http://localhost:18080');

function browserLogin(email, pass, location) {
    return function(done) {
        browser
            .post('/login')
            .send({ emailaddress: email, password: pass })
            .expect(302)
            .expect('Location',location)
            .end(function(err,res){
              return done(err);
            });
    };
};

function browserRegCheckReturn(email, pass, name, data) {
    return function(done) {
        browser
            .post('/reg')
            .send({ email: email, password: pass, name:name})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(data)
            .end(function(err,res){
              return done(err);
            });
    };
};
function browserRegCheckFunction(email, pass, name, func) {
    return function(done) {
        browser
            .post('/reg')
            .send({ email: email, password: pass, name:name})
            .expect(200)
            .expect('Content-Type', /json/)            
            .end(function(err,res){
              func(err,res);
              done();
            });
    };
};

describe('Auth API', function(){

  describe('post /login', function(){    
    it('user cannot login with incorrent info', browserLogin('playwew@126.com','whoareyou','/login'));
    it('user cannot login with only emailaddress',browserLogin('playwew@126.com',null,'/login'))
    it('user cannot login with only password',browserLogin(null,'whoami','/login'))
    it('user can login with correct info', browserLogin('playwew@126.com','whoami',/user/));   
  }) 
  
  describe('get  /logout', function(){
    it('user can logout after login', function(done){
      browser.get('/logout')
             .expect(302)
             .expect('location','/')
             .end(function(err, res){return done(err)});
    });
  })   

  describe('get  /API/logout', function(){
    it('use can use /API/logout to logout', function(done){
      browser
          .post('/login')
          .send({ emailaddress: 'playwew@126.com', password: "whoami" })
          .expect(302)
          .expect('Location',/user/)

      browser.get('/API/logout')
             .expect(200)
             .expect('Content-Type', /json/)             
             .end(function(err, res){return done(err)});
    });
  })

  describe('post /reg', function(){    
    it('miss email cannot register', browserRegCheckReturn(null,'whoami','avoid',{state:'error',errorNumber: 35, message: 'miss info'}));
    it('miss password cannot register', browserRegCheckReturn('test@126.com',null,'avoid',{state:'error',errorNumber: 35, message: 'miss info'}));
    it('miss name cannot register', browserRegCheckReturn('1@1.com','whoami',null,{state:'error',errorNumber: 35, message: 'miss info'}));
    it('one email cannot register twice', browserRegCheckFunction('playwew@126.com','whoami','aname', function(err,res){res.body.state.should.equal('error')}));
    it('one email cannot register twice', browserRegCheckFunction('1@1','whoami','bryce', function(err,res){res.body.state.should.equal('error')}));
    it('invalidate email cannot register',browserRegCheckReturn('email','whoami','aname',{state:'error',errorNumber: 26, message: 'email format error'}));
    it('invalidate email cannot register',browserRegCheckReturn('email@163','whoami','aname',{state:'error',errorNumber: 26, message: 'email format error'}));
    it('real register shoule be done manually')
  })                                                                  
                    
  describe('get  /auth/e/:email/t/:token', function(){
    it('validated email and token shall not pass',function(done){
      browser.get('/auth/e/playwew@126.com/t/xxxxxxx')             
             .expect('Content-Type', /json/)                          
             .end(function(err,res){res.body.state.should.equal('error');return done()});
    });
    it('fake email and token shall not pass', function(done){
      browser.get('/auth/e/xxx@126.com/t/xxxxxxx')             
             .expect('Content-Type', /json/)                          
             .end(function(err,res){res.body.state.should.equal('error');return done()});
    });
    it('real active shoule be done manually');
  })
});                  