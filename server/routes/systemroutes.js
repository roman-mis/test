'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/systemController')(db);

module.exports = function(app){
  app.use('/api/system', router);
};

router.get('/', controller.getSystem);
router.patch('/', controller.patchSystem);