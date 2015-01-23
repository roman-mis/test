'use strict';

var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
	db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/template')(db),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware')
	
;
var awsservice=require('../services/awsservice');

module.exports = function(app){
  app.use('/api/templates', router);
};

router.get('/',restMiddleware(db),controller.getAllTemplates);
router.post('/', controller.postTemplate );
router.get('/:id',controller.getTemplate);
