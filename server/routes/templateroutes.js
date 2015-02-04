'use strict';

var express = require('express'),
    router = express.Router(),
    db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/template')(db),
	restMiddleware=require('../middlewares/restmiddleware');

module.exports = function(app){
  app.use('/api/templates', router);
};

router.get('/',restMiddleware(db),controller.getAllTemplates);
router.post('/', controller.postTemplate );
router.get('/:id',controller.getTemplate);
