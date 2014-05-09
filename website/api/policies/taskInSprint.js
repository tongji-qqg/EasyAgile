// api/policies/taskInSprint.js

/**
 * Policy to check if user has access to specified project or not. Actual check is
 * done by one of following internal AuthService methods;
 *
 *  - taskInSprint
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
module.exports = function taskInSprint(request, response, next) {
    sails.log.verbose("POLICY - api/policies/taskInSprint.js");

    var sid = request.params.sid,
        tid = request.params.tid;
    
    // Check that current user has access to specified project
    DataService.isTaskInSprintById(sid, tid, function(error, result) {
        if (error) { // Error occurred
            response.json(error);
        }
        else { 
            if(result) {
                sails.log.verbose("taskInSprint OK");    
                next();
            } else {
                response.json(ErrorService.taskNotFindError);       
            }
        }
    });
    
};
