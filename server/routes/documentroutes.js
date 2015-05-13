'use strict';

var express = require('express'),
    db = require('../models'),
    controller=require('../controllers/documentscontroller')(db),
    router = express.Router(),
    expressJwt = require('express-jwt'),
    routeDefaultModifier=require('../middlewares/routeDefaultModifier');


module.exports = function(app){
  app.use('/api/documents', expressJwt({secret:process.env.JWT_SECRET}), router);
};

router.get('/signTempS3',controller.getUploadDocumentSignedUrl);
router.get('/signTempViewdocS3',controller.getViewDocumentSignedUrl);
router.delete('/delete/:fileName',controller.deleteTempDocument);

router.get('/:id/avatar/signedurl',controller.getAvatarSignedUrl);
router.get('/:id/avatar/viewsignedurl',controller.getViewAvatarSignedUrl);

router.get('/receipts/signedUrl',controller.getUploadReceiptSignedUrl);
router.get('/receipts/:receiptName',controller.viewReceipt);
router.get('/receipts/viewsignedurl/:fileName',routeDefaultModifier({params:{folder:'receipts'}}),controller.viewDocSignedUrl);
router.delete('/receipts/:receiptName',controller.deleteReceipt);

router.get('/timesheet/signedUrl',routeDefaultModifier({params:{folder:'timesheet'}}),controller.getUploadDocSignedUrl);
router.get('/actionrequest/signedUrl',routeDefaultModifier({params:{folder:'actionrequest'}}),controller.getUploadDocSignedUrl);
router.get('/actionrequest/viewsignedurl/:fileName',routeDefaultModifier({params:{folder:'actionrequest'}}),controller.viewDocSignedUrl);
router.get('/timesheet/:fileName',routeDefaultModifier({params:{folder:'timesheet'}}),controller.viewDoc);
router.delete('/timesheet/:fileName',routeDefaultModifier({params:{folder:'timesheet'}}),controller.deleteDoc);
