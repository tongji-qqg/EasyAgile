/**
 * AuthController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */
"use strict";

module.exports = {
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AuthController)
     */
    _config: {       
    },


    /**
    * Logout action, just logout user and then redirect back to login page.
    *
    * @param   {req}   request     Request object
    * @param   {res}  response    Response object
    */
    reg: function(req, res) {
        sails.log.verbose('Controller - api/controller/AuthController.reg');
        var newUser = {
            name  : req.body.name,
            email : req.body.email,
            password: req.body.password
        };
        userService.register(newUser, function(err, user){
                if(err){
                    console.log('register err '+ err.message);                  
                    res.json(err);                  
                }
                else{
                    console.log('register successs! ');
                    //req.session.user = user; //用户信息存入session
                    //req.session.save();
                  
                    //res.header('Access-Control-Allow-Credentials', 'true');                 
                    res.json(ErrorService.success);
                }
            });     
    },


    /**
    * Logout action, just logout user and then redirect back to login page.
    *
    * @param   {req}   request     Request object
    * @param   {res}  response    Response object
    */
    logout: function(req, res) {
        sails.log.verbose('Controller - api/controller/AuthController.logout');
        req.session.user = null;  

        res.redirect('/');
    },

    apiLogout: function(req, res) {
        sails.log.verbose('Controller - api/controller/AuthController.apilogout');
        req.session.user = null;        
        res.json(ErrorService.success);
    },

   /**
     * Authentication action, this uses passport local directive to check if user is valid user or not.
     *
     * @todo how to support multiple authentication directives?
     *
     * @param   {req}   request     Request object
     * @param   {res}  response    Response object
     */
    login: function(req, res) {
        sails.log.verbose('Controller - api/controller/AuthController.login');
        userService.loginByEmail(req.body.emailaddress, req.body.password,function(err,result){
            if(err){
                console.log(err);
                req.flash('message', err.message);
                res.redirect('/login');
            }
            else{
                console.log(result);
                req.session.user = result;
                res.redirect('/user/'+result._id);
            }
         });
    },

    activateEmail: function(req, res){
        sails.log.verbose('Controller - api/controller/AuthController.activateEmail');
        userService.activateEmail(req.params.email, req.params.token, function(err, user){
            if(err) return res.json(err);
            req.session.user = user; //用户信息存入session
            res.redirect('/user/'+user._id);
            //req.session.save();
        })
    }
};
