// api/policies/validateProjectisAlive.js

/**
 * Policy to check if user has access to specified project or not. Actual check is
 * done by one of following internal AuthService methods;
 *
 *  - validateProjectisAlive
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
module.exports = function validateProjectisAlive(request, response, next) {
    sails.log.verbose("POLICY - api/policies/validateProjectisAlive.js");

    var pid = request.params.pid;
    
    // Check that current user has access to specified project
    DataService.getProjectById(pid, function(error, project) {
        if (error) { // Error occurred
            response.json(error);
        }
        else { 
            if(project.done) {
                sails.log.verbose("validateProjectisAlive Err");    
                response.json(ErrorService.projectIsArchived);                       
            } else {
                sails.log.verbose("validateProjectisAlive OK");  
                next();
            }
        }
    });
    
};
