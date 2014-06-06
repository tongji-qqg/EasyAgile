// Start sails and pass it command line arguments
process.env.NODE_ENV == 'production'

if(process.env.NODE_ENV == 'production'){
	require('posix').setrlimit('nofile', { soft: 10000 });
}
//do not use memcached, not improve performance
//but reserve it here for future use
require('sails').lift({log:{level:'error'},memcached:false});