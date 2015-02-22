'use strict';
var glob = require('glob'),
    gzippo = require('gzippo'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    path = require('path'),
    responseHandler=require('../middlewares/responsehandler'),
    urlhelper=require('../middlewares/urlhelper'),
    multer=require('multer');
    var busboy=require('connect-busboy');


module.exports = function(app){
  app.set('port', process.env.PORT || 3000);
  // app.use('/api', expressJwt({secret:process.env.JWT_SECRET})
  //   .unless({path:[/\/api\/users\/emailvalidation?/,'/api/candidates']}));
  
  app.use(logger('dev'));
  
  app.use(busboy());
  app.use(multer({ inMemory:true}));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compress());
  app.use(methodOverride());
  
  app.use(responseHandler(app));
  app.use(urlhelper());

  var routes = glob.sync(path.normalize(__dirname + '/..') + '/routes/**/*routes.js');
  routes.forEach(function(route){
    require(route)(app);
  });
  
  //angular distribution server
  app.use('/scripts', gzippo.staticGzip(__dirname + '/../../dist/scripts'));
  app.use('/images', gzippo.staticGzip(__dirname + '/../../dist/images'));
  app.use('/styles', gzippo.staticGzip(__dirname + '/../../dist/styles'));
  app.use('/views', gzippo.staticGzip(__dirname + '/../../dist/views'));
  app.use('/fonts', gzippo.staticGzip(__dirname + '/../../dist/fonts'));
  app.all('/*', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/../../dist'});
  });  
  
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res) {
      console.log(err);
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res) {
     console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });


};