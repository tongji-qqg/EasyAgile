/*
 * Module dependencies
 */ 

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
//var MongoStore = require('connect-mongo')(express)
var settings = require('./settings')
var ejs = require('ejs');
var port = 18080;

var app = express();

// all exvironments
app.set('port',port);
app.set('views',path.join(__dirname,'/views'));

app.engine('.html',ejs.__express);
app.set('view engine','html');

app.use(express.favicon(__dirname+'/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,
//  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//  store: new MongoStore({
//    db: settings.db
//  })
}));

app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));

if ( 'development' == app.get('env')){
//	app.use(express.errorHandler);
}

http.createServer(app).listen(app.get('port'),function(){
	console.log('Express server listening on port '+app.get('port'));
});

routes(app);
