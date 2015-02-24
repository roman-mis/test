'use strict';

var express = require('express'),
    router = express.Router(),

    db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/timesheetBatchController')(db),
	restMiddleware=require('../middlewares/restmiddleware');

module.exports = function(app){
  app.use('/api/timesheetbatches', router);
};

router.get('/', restMiddleware(db), controller.getAllTimesheetBatches);