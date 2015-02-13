'use strict';

var express = require('express'),
    router = express.Router(),

    db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/invoiceController')(db),
	restMiddleware=require('../middlewares/restmiddleware');

module.exports = function(app){
  app.use('/api/invoice', router);
};

router.get('/', restMiddleware(db), controller.getAllInvoices);
router.get('/:id', controller.getInvoice);
router.post('/', controller.postInvoice);
router.patch('/:id', controller.patchInvoice);