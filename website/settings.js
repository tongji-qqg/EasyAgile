
var dev = true;

if(dev){
	module.exports = { 
		cookieSecret: 'EasyAgile', 
		db: 'user', 
		host: 'localhost',
		port: 27017,
		username: '',
		password: ''		
	};
} else {
	module.exports = {
		cookieSecret: 'EasyAgile', 
		db: 'MHByTWVjNkAUPcntmCMD',
		host: 'mongo.duapp.com',
		port: 8908,
		username: 'EaxsEdYQnL5ogBm6FmYxGMGD',
		password: 'cGuOOTTdr2skIIQG37LXDgU1xxenXuuE'
	}
}
