'use strict';
var URL = require('url');
module.exports = function (authorizer,options) {
  var parent = authorizer;

  var options = Array.isArray(options) ? options : [options];

  return function (req, res, next) {
    console.log('route skipper called');
    var url = URL.parse(req.originalUrl || req.url || '', true);

    var skip = false;

    options.forEach(function(opts){
        if (opts.custom) {
          skip = skip || opts.custom(req);
        }


        var exts = !opts.ext || Array.isArray(opts.ext) ?
                   opts.ext : [opts.ext];

        if (exts) {
          skip = skip || exts.some(function (ext) {
            return url.pathname.substr(ext.length * -1) === ext;
          });
        }
       

        if(!skip && opts.path){
          // console.log('checking skip '+skip);
          // console.log('opts.method===req.method    '+(opts.method===req.method));
          // console.log('req.method='+req.method + ' and opts.method='+opts.method);
        //  console.log("(typeof opts.path === 'string' && opts.path === url.pathname)    "+(typeof opts.path === 'string' && opts.path === url.pathname));
        //    console.log("(opts.path instanceof RegExp && !!opts.path.exec(url.pathname))      "+(opts.path instanceof RegExp && !!opts.path.exec(url.pathname)));
        var pathNameMatched=false;
        var myPaths=Array.isArray(opts.path)?opts.path:[opts.path];
        myPaths.forEach(myPaths,function(pth){
          if((typeof pth === 'string' && pth === url.pathname)){
            pathNameMatched=true;
            return false;
          }
          else if (pth instanceof RegExp && !!pth.exec(url.pathname)) {
            pathNameMatched=true;
            return false;
          }

        });
        skip=(opts.method?opts.method===req.method:true) && pathNameMatched;
          // skip=(opts.method?opts.method===req.method:true) && ((typeof opts.path === 'string' && opts.path === url.pathname) ||
          //          (opts.path instanceof RegExp && !!opts.path.exec(url.pathname)));
          // console.log('is skip   '+skip);
        }

        return !skip;
    });

    console.log('URL : '+url.pathname + '  =  '+' method ='+req.method+'  : '+skip);

    if (skip) {
      return next();
    }

    parent(req, res, next);

  };
};