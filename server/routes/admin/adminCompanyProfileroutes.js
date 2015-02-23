'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../../models'),
	controller=require('../../controllers/admin/adminCompanyProfile')(),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../../middlewares/restmiddleware'),
	routeskipper=require('../../middlewares/route-skipper');

module.exports = function(app){
  app.use('/api/admin/companyProfile',restMiddleware(db),routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[]), router);
};

// console.log('xxx');

router.get('/', controller.getAllAdminCompanyProfile);
// router.get('/:id', controller.getAdminCompanyProfile);
// router.put('/:id', controller.editAdminCompanyProfileContact);
router.post('/:id',controller.editAdminCompanyProfile);
router.post('/', controller.saveAdminCompanyProfile);
router.delete('/:id', controller.deleteAdminCompanyProfile);
