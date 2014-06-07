// api/policies/remember.js
'use strict'
/**
 * Policy to check if user use browser set rememberme cookie
 * done by one of following internal AuthService methods;
 *
 *
 * Note that this policy relies one of following parameters are:
 *
 *  - req.session.user
 * 
 */
module.exports = function checkLogin(req, res, next) {
  sails.log.verbose("POLICY - api/policies/remember.js");

  // User is not login, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.user) {
    return next();
  }

  if(req.cookies.remember_me && req.cookies.uid){    
    AuthService.tryToRecall(req, res, function(err, user){
      if(err) return next();
      req.session.user = DataService.makeUserInfo(user);
      next();    
    });
  }else{
    next();
  }      
};
