'use strict';

var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
	db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/invoicedesigncontroller')(db),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware')
	
;
var awsservice=require('../services/awsservice');

module.exports = function(app){
  app.use('/api/invoicedesigns', router);
};

router.get('/',restMiddleware(db),controller.getAllInvoiceDesigns);
router.get('/:id',controller.getInvoiceDesign);
router.post('/', controller.postInvoiceDesign);
router.patch('/', controller.patchInvoiceDesign);