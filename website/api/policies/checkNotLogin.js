// api/policies/hasNotLogin.js
'use strict'
/**
 * Policy to check if user has login
 * done by one of following internal AuthService methods;
 *
 *
 * Note that this policy relies one of following parameters are:
 *
 *  - req.session.user
 * 
 */
module.exports = function checkNotLogin(req, res, next) {
  sails.log.verbose("POLICY - api/policies/hasNotLogin.js");

  // User is not login, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (!req.session.user) {
    return next();
  }
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  // return res.forbidden('You are not permitted to perform this action.');
  req.flash.message("You are login!", "error");
  return res.redirect('/');
};
