'use strict';

var express = require('express'),
    router = express.Router(),

    db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/invoiceDesignController')(db),
	restMiddleware=require('../middlewares/restmiddleware');
module.exports = function(app){
  app.use('/api/invoicedesigns', router);
};

router.get('/',restMiddleware(db),controller.getAllInvoiceDesigns);
router.get('/:id',controller.getInvoiceDesign);
router.post('/', controller.postInvoiceDesign);
router.patch('/:id', controller.patchInvoiceDesign);