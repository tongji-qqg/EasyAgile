// api/policies/hasProjectAccess.js

/**
 * Policy to check if user has access to specified project or not. Actual check is
 * done by one of following internal AuthService methods;
 *
 *  - hasProjectAccess
 *
 * Note that this policy relies one of following parameters is present:
 *
 *  - id
 *  - projectId
 *
 * Actual auth checks are done depending of given parameters.
 *
 * @param   {Request}   request     Request object
 * @param   {Response}  response    Response object
 * @param   {Function}  next        Callback function to call if all is ok
 */
module.exports = function hasProjectAccess(request, response, next) {
    sails.log.verbose("POLICY - api/policies/hasProjectAccess.js");

    var uid = request.params.uid || request.session.user._id, 
        pid = request.params.pid;
    
    // Check that current user has access to specified project
    AuthService.hasProjectAccess(uid, pid, function(error, hasRight) {
        if (error) { // Error occurred
            response.json(error);
        }
        else { // Otherwise all is ok
            sails.log.verbose("hasProjectAccess OK");
            next();
        }
    });
    
};
