'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../../models'),
	controller=require('../../controllers/admin/adminRti')(),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../../middlewares/restmiddleware'),
	routeskipper=require('../../middlewares/route-skipper');

module.exports = function(app){
  app.use(
        '/api/admin/rti',
      restMiddleware(db),
      routeskipper(
          expressJwt({
              secret:process.env.JWT_SECRET
          }),
          []
      ), 
      router
  );
};

router.get('/', controller.getRti);
router.post('/', controller.saveRti);