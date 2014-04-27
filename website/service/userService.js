
var userModel = require('../schemas/userSchema');



var databaseError = {
		message: 'database error!'
	},
	dataNotFindError = {
		message: 'data not find!'
	},
	userNotFindError = {
		message: 'user not find!'
	},
	passwordNotRightError = {
		message: 'password not correct'
	};

exports.register = function(userInfo, callback){
	
	var user = new userModel(userInfo);

	user.save(callback);

};

exports.findUserByEmail = function(email, callback){

	userModel.findOne({ 'email' : email }, function(err, result){
		if(err) callback(databaseError);
		if(result == null) callback(userNotFindError);
		else{
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

};

exports.loginByEmail = function(email, password, callback){

	userModel.findOne({ 'email' : email }, function(err, result){		
		if(err) callback(databaseError);
		else if(result == null) callback(userNotFindError);
		else{
			if(password !== result.password)
				return callback(passwordNotRightError);
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

}

exports.findUserById = function(id, callback){

	userModel.findById(id, function(err, result){
		if(err) callback(databaseError);
		if(result == null) callback(userNotFindError);
		else{
			var user = {
				_id: result._id,
				email: result.email,
				name: result.name,
				icon: result.icon				
			};
			callback(null,user);
		}
	});

};

exports.updateUserInfo = function(id, toUser, callback){

	userModel.findOneAndUpdate({'_id':id},{ $set: toUser},callback);

};