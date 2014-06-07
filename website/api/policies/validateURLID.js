// api/policies/validateURLID.js

/**
 * Policy to check if user has admin right to specified project or not. Actual check is
 * done by one of following internal AuthService methods;
 *
 *  - validateURLID
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
module.exports = function validateURLID(request, response, next) {
    sails.log.verbose("POLICY - api/policies/validateURLID.js");

    var valid = true;
    var ids =[request.params.uid,  //user
              request.params.pid,  //project
              request.params.tid,  //task || topic
              request.params.sid,  //sprint
              request.params.mid,  //message
              request.params.eid,  //editor
              request.params.bid,  //backlog
              request.params.rid,  //requirement
              request.params.iid,  //issue
              request.params.cid,  //comment
              request.params.fid,  //file
              request.params.aid]; //alert
        ids.forEach(function(id){
            if(id && id.length!=24)
                valid = false;
        });
        if(valid){
            sails.log.verbose("validateURLID OK");
            next();            
        }else{
            sails.log.warn("validateURLID Error");
            var type = request.accepts('json','html');
            if(type === 'html') response.view('404');
            else response.json(ErrorService.wrongURLID);
        }        
        
    // Check that current user has access to specified project
    
};
