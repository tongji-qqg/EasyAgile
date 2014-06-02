var StaticController = require('../../api/controllers/StaticController'),
    sinon = require('sinon'),
    assert = require('assert');
function shouldRenderTheView(method, view){
  return function(){
    var cb = sinon.spy();
    StaticController[method]({session:{}}, {view: cb});
    assert.ok(cb.called);
    assert.equal(view, cb.args[0][0], view);    
  }
}

describe('Static API', function(){


  describe('get /', function(){
    it('should render the view index', shouldRenderTheView('index', 'index'));
  })                                      
  describe('get /mobile', function(){
    it('should render the view mobile', shouldRenderTheView('mobile', 'mobile'));
  })


  describe('get /reg', function(){
    it('should render the view auth/signup', shouldRenderTheView('reg', 'auth/signup'));
  })                                   
  describe('get /login', function(){
    it('should render the view auth/login', shouldRenderTheView('login','auth/login'));
  })                            


  describe('get /user/:uid', function(){
    it('should render the view', shouldRenderTheView('userMain', 'user/user_project'));
  })                             
  describe('get /user_task/:uid', function(){
    it('should render the view')
  })                        
  describe('get /user_cal/:uid', function(){
    it('should render the view', shouldRenderTheView('userCal', 'user/user_cal'));
  })                         
  describe('get /user_message/:uid', function(){
    it('should render the view', shouldRenderTheView('userMessage', 'user/user_message'));
  })                     

  describe('get /project/:pid', function(){
    it('should respond with json');
  })
                            
  describe('get /project_taskboard/:pid', function(){
    it('should respond with json');
  })
                  
  describe('get /project_cal/:pid', function(){
    it('should respond with json');
  })
                        
  describe('get /project_issue/:pid', function(){
    it('should respond with json');
  })
                      
  describe('get /project_files/:pid', function(){
    it('should respond with json');
  })
                      
  describe('get /project_topic/:pid', function(){
    it('should respond with json');
  })
                      
  describe('get /project_editor/:pid', function(){
    it('should respond with json');
  })
                     
  describe('get /project_members/:pid', function(){
    it('should respond with json');
  })
                    
  describe('get /project_newTopic/:pid', function(){
    it('should respond with json');
  })
                   
  describe('get /project_oneTopic/:pid/t/:tid', function(){
    it('should respond with json');
  })
            
  describe('get /project_history/:pid', function(){
    it('should respond with json');
  })
}); 