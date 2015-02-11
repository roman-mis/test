'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/adminCompanyProfileContact')(),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	routeskipper=require('../middlewares/route-skipper');

module.exports = function(app){
  app.use('/api/admin/companyProfile/contact',restMiddleware(db),routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[]), router);
};

console.log('xxx');

router.get('/', controller.getAllAdminCompanyProfileContact);
router.get('/:id', controller.getAdminCompanyProfileContact);
router.put('/:id', controller.editAdminCompanyProfileContact);
router.post('/', controller.saveAdminCompanyProfileContact);
router.delete('/:id', controller.deleteAdminCompanyProfileContact);
