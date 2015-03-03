'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
    expressJwt = require('express-jwt'),
	controller=require('../controllers/timesheetController')(db),
	restMiddleware=require('../middlewares/restmiddleware');

module.exports = function(app){
  app.use('/api/timesheets', expressJwt({secret:process.env.JWT_SECRET}), router);
};

router.get('/', restMiddleware(db), controller.getTimesheets);
router.get('/:id', controller.getTimesheet);
router.post('/', controller.postTimesheet);
router.post('/uploadcsv', controller.uploadTimesheet);
router.post('/:id', controller.patchTimesheet);
