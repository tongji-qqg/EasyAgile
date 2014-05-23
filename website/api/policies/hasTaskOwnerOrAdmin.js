// api/policies/hasTaskOwnerOrAdmin.js

/**
 * Policy to check if user has admin right to specified project or not. Actual check is
 * done by one of following internal AuthService methods;
 *
 *  - hasTaskOwnerOrAdmin
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
module.exports = function hasTaskOwnerOrAdmin(request, response, next) {
    sails.log.verbose("POLICY - api/policies/hasTaskOwnerOrAdmin.js");

    var uid = request.session.user._id, 
        pid = request.params.pid,
        tid = request.params.tid;
    
    // Check that current user has access to specified project
    var flag = false;
    async.series([
        function(callback){
            DataService.getTaskById(tid, function(error,task){
                if(error) return callback(error);
                //sails.log.verbose(task.executer);
                for(var i=0;i<task.executer.length;i++){
                    //sails.log.verbose(task.executer[i]+'  '+uid);
                    //sails.log.verbose(task.executer[i] == uid);
                    //sails.log.verbose(task.executer[i].equals(uid));
                    if(task.executer[i] == uid)flag = true;
                }
                callback(null);
            });
        },
        function(callback){
            if(flag == true) return callback(null);
            AuthService.hasProjectAdmin(uid, pid, function(error, hasRight) {
                if (error) { // Error occurred
                    return callback(error);
                }
                else { // Otherwise all is ok
                    flag = true;
                    callback(null);
                }
            });
        },
    ],function(err){
        if(err) return response.json(ErrorService.notHaveChangeTaskPermission);
        if(!flag) return response.json(ErrorService.notHaveChangeTaskPermission);
        sails.log.verbose("hasTaskOwnerOrAdmin OK");
        next();
    });
};
