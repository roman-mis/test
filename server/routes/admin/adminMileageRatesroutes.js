'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../../models'),
	controller=require('../../controllers/admin/adminMileageRates')(db),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../../middlewares/restmiddleware'),
	routeskipper=require('../../middlewares/route-skipper');

module.exports = function(app){
  app.use(
        '/api/systems/mileagerates',
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

router.get('/', controller.getMileageRates);
router.patch('/', controller.saveMileageRates);