'use strict';

var express = require('express'),
     router = express.Router(),
	   db = require('../../models'),
	   controller=require('../../controllers/admin/adminActionRequestController')(db),
	   expressJwt = require('express-jwt'),
	   restMiddleware=require('../../middlewares/restmiddleware'),
	   routeskipper=require('../../middlewares/route-skipper');

module.exports = function(app){
  app.use('/api/actionrequests',restMiddleware(db),routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[]), router);
};

router.get('/:id/ssp/verify', controller.checkSspQualification);
router.get('/:id/smp/verify', controller.checkSmpQualification);
router.get('/:id/spp/verify', controller.checkSppQualification);

router.post('/:id/ssp', controller.postSsp);

router.post('/:id/ssp', controller.postSmp);

router.post('/:id/spp', controller.postSpp);

router.post('/:id/holidaypay', controller.postHolidayPay);