// api/policies/validateTaskOwner.js

/**
 * Policy to check if user has admin right to specified project or not. Actual check is
 * done by one of following internal AuthService methods;
 *
 *  - validateTaskOwner
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
module.exports = function validateTaskOwner(request, response, next) {
    sails.log.verbose("POLICY - api/policies/validateTaskOwner.js");

    var executers = request.body.executer;
        pid = request.params.pid;
    
    if(!executers || executers ===[])
    {
        sails.log.verbose("validateTaskOwner OK"); 
        return next();
    }
    // Check that executers to specified project
    var flag = true;
    async.waterfall([
        function(callback){
            DataService.getProjectById(request.params.pid,callback);
        },
        function(project, callback){
            executers.forEach(function(u){                
                var permission = false;
                if(u == project.owner) permission = true;
                var member = project.members.id(u);         
                if(member != null) permission = true;
                if(!permission){
                    sails.log.verbose('validateTaskOwner fail '+ u+'typeofu '+typeof(u));
                    flag = false;
                }
            })
            callback(null);
        },
    ],function(err){
        if(err) return response.json(err);
        if(!flag) return response.json(ErrorService.memberNotFindError);
        sails.log.verbose("validateTaskOwner OK"); 
        next();
    });
};
