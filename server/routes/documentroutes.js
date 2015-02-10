'use strict';

var express = require('express'),
    db = require('../models'),
    controller=require('../controllers/documentscontroller')(db),
    router = express.Router(),
    expressJwt = require('express-jwt');


module.exports = function(app){
  app.use('/api/documents', expressJwt({secret:process.env.JWT_SECRET}), router);
};

router.get('/signTempS3/:folder?',controller.getUploadDocumentSignedUrl);

router.get('/signTempViewdocS3/:folder?',controller.getViewDocumentSignedUrl);
router.delete('/delete/:fileName/:folder?',controller.deleteTempDocument);
