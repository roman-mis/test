'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/admintemplates')(),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	routeskipper=require('../middlewares/route-skipper');

module.exports = function(app){
  app.use('/api/admin/templates',restMiddleware(db),routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[]), router);
};

router.get('/',controller.getAlladminTemplates);
router.get('/:id',controller.getAdminTemplate);

router.post('/:id',controller.updateAdminTemplate);

router.post('/',controller.saveTemplate);

router.delete('/:id',controller.deleteAdminTemplate);
