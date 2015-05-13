'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    controller=require('../controllers/authenticate')(db);
module.exports = function(app){
  app.use('/api', router);
};

router.post('/authenticate', controller.authenticate);
router.post('/editprofilepassword', controller.changePassword);
