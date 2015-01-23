'use strict';

var express = require('express'),
    jwt = require('jsonwebtoken'),
    db = require('../models'),
    controller=require('../controllers/public')(db),
    router = express.Router()
  ;


module.exports = function(app){
  app.use('/api/public', router);
};

router.get('/candidates/emailvalidation/:email_address',controller.emailValidation);


router.get('/sign_s3', controller.signS3);




/*test api end points*/

router.get('/getfile/:filename',controller.getFile);

router.post('/testmailing',controller.testMailing);

router.get('/verifybcrypt/:password',controller.verifyBcrypt);

router.put('/copy_s3', controller.copy_s3);

router.put('/move_s3', controller.move_s3);

router.post('/addagencybranch/:id',controller.addagencybranch);

router.get('/agencies',controller.agencies);

router.get('/agencies/branches',controller.branches);

router.get('/testagencypopulate',controller.testagencypopulate);

router.get('/testagencybybranchid',controller.testagencybybranchid);

router.post('/setcandidatebranch',controller.setcandidatebranch);

router.post('/putagencybranchincandidate/:id',controller.putagencybranchincandidate);

router.get('/getuserwithbranchpopulate/:id',controller.getuserwithbranchpopulate);

router.get('/user1/',controller.getAllUsers);

router.get('/user1/:id',controller.getUser);

router.get('/testlogger',controller.testlogger);