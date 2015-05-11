'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../../models'),
	controller=require('../../controllers/admin/statutoryRates')(),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../../middlewares/restmiddleware'),
	routeskipper=require('../../middlewares/route-skipper');

module.exports = function(app){
  app.use('/api/systems/statutoryRates',restMiddleware(db),routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[]), router);
};

router.get('/', controller.getAllAdminStatutoryRates);
// router.get('/:id', controller.getAdminStatutoryRates);
// router.put('/:id', controller.editAdminStatutoryRates);
router.post('/edit/:type/:id',controller.editAdminStatutoryRates);
router.post('/add/:type', controller.addToAdminStatutoryRates);
router.delete('/:type/:id', controller.deleteFromAdminStatutoryRates);
