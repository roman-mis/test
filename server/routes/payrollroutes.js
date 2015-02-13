'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/payrollController')(db),
	restMiddleware=require('../middlewares/restmiddleware');

module.exports = function(app){
  app.use('/api/payroll', router);
};

router.get('/', restMiddleware(db), controller.getAllPayrolls);
router.get('/:id', controller.getPayroll);
router.post('/', controller.postPayroll);
router.patch('/:id', controller.patchPayroll);