'use strict';

var express = require('express'),
    jwt = require('jsonwebtoken'),
    db = require('../models'),
    controller=require('../controllers/documentscontroller')(db),
    router = express.Router(),
    expressJwt = require('express-jwt'),
    
    restMiddleware=require('../middlewares/restmiddleware')
  ;


module.exports = function(app){
  app.use('/api/documents', expressJwt({secret:process.env.JWT_SECRET}), router);
};

router.get('/sign_temp_s3',controller.getUploadDocumentSignedUrl);
router.get('/sign_temp_viewdoc_s3',controller.getViewDocumentSignedUrl);
router.delete('/delete/:fileName',controller.deleteTempDocument);
