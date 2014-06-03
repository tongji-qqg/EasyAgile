// Start sails and pass it command line arguments
process.env.NODE_ENV == 'production'

if(process.env.NODE_ENV == 'production'){
	require('posix').setrlimit('nofile', { soft: 10000 });
}
require('sails').lift({log:{level:'error'});