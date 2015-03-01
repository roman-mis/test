'use strict';

var express = require('express'),
    router = express.Router(),

    db = require('../../models'),
	router = express.Router(),
	controller=require('../../controllers/admin/importExportTemplates')(db),
	restMiddleware=require('../../middlewares/restmiddleware');
	
module.exports = function(app){
  app.use('/api/imExTeplates', router);
};

router.get('/',restMiddleware(db),controller.getAllTemplates);
router.post('/', controller.postTemplate );
router.delete('/:id',controller.deleteTemplate);
