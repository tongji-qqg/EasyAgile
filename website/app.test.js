process.env.NODE_ENV = 'test';
require('sails').lift({log:{level:'info'}, dbname:'eatest'});