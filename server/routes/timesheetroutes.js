'use strict';

var express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt'),
	controller=require('../controllers/timesheetController')();

module.exports = function(app){
  app.use('/api/timesheet', expressJwt({secret:process.env.JWT_SECRET}), router);
};

router.get('/', controller.getTimesheets);
router.get('/:id', controller.getTimesheet);
router.post('/', controller.postTimesheet);
router.patch('/:id', controller.patchTimesheet);