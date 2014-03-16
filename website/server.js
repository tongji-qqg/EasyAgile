/*
 * Module dependencies
 */ 

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express)
var settings = require('./settings')
var flash = require('connect-flash');
var ejs = require('ejs');
var port = 18080;

var app = express();

// all exvironments
app.set('port',port);
app.set('views',path.join(__dirname,'/views'));

app.engine('.html',ejs.__express);
app.set('view engine','html');

app.use(flash());
app.use(express.favicon(__dirname+'/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db
  })
}));

/*
app.use(function(req, res, next) {
	res.locals.error = req.flash('error').toString();
	res.locals.success = req.flash('success').toString();
	res.locals.user = req.session ? req.session.user : null;
	next();
});
*/
app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));

if ( 'development' == app.get('env')){
//	app.use(express.errorHandler);
}

http.createServer(app).listen(app.get('port'),function(){
	console.log('Express server listening on port '+app.get('port'));
});

routes(app);
