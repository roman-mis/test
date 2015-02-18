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

router.get('/paymentrates', controller.getPaymentRates);
router.post('/paymentrates', controller.postPaymentRates);
router.patch('/paymentrates/:id', controller.patchPaymentRates);

router.get('/vat', controller.getVat);
router.get('/vat/current', controller.getCurrentVat);
router.post('/vat', controller.postVat);
router.patch('/vat/:id', controller.patchVat);