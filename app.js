
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var  MongoStore = require('connect-mongo')(express);  //不一样！注意了！
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser())
  app.use(express.session({
      secret: settings.cookieSecret,
      store : new MongoStore({
          db : settings.db
      })
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(flash());
  //app.use(express.router(routes));      3.0已经不再使用这个了。
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
app.use(function(req, res, next){
    if (req.session.user)
        res.locals.user = req.session.user;
    else
        res.locals.user = null;
    var err = req.flash('error');
    if (err.length)
        res.locals.error = err;
    else
        res.locals.error = null;
    var succ = req.flash('success');
    if (succ.length)
        res.locals.success = succ;
    else
        res.locals.success = null;

    next();
});
app.get('/', routes.index);
//app.get('/u/:user', routes/user.list);
//app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.dologin);
//app.get('/logout', routes.logout);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
