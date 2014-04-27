////////////////////////////////////////////////////////////////////////////////////////
//
//               helper functions
//
////////////////////////////////////////////////////////////////////////////////////////


exports.checkLogin = function(req, res, next){
    if(!req.session.user){
	      return res.redirect('/login');
    }
    next();
}

exports.checkNotLogin = function(req,res,next){
    if(req.session.user){
	      return res.redirect('/');
    }
    next();
}

exports.checkUser = function (req,res,next){
	next();
}

exports.checkProjectMember = function (req,res,next){
	next();
}

exports.checkProjectAdmin = function (req,res,next){
	next();
}