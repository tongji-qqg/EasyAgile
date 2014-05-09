// api/policies/sprintInProject.js

/**
 * Policy to check if user has access to specified project or not. Actual check is
 * done by one of following internal AuthService methods;
 *
 *  - sprintInProject
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
module.exports = function sprintInProject(request, response, next) {
    sails.log.verbose("POLICY - api/policies/sprintInProject.js");

    var pid = request.params.pid,
        sid = request.params.sid;
    
    // Check that current user has access to specified project
    DataService.isSprintInProjectById(pid, sid, function(error, result) {
        if (error) { // Error occurred
            response.json(error);
        }
        else { 
            if(result) {
                sails.log.verbose("sprintInProject OK");    
                next();
            } else {
                response.json(ErrorService.sprintNotFindError);       
            }
        }
    });
    
};
