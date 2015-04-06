'use strict';

var express = require('express'),
     router = express.Router(),
	   db = require('../../models'),
	   controller=require('../../controllers/admin/adminActionRequestController')(db),
	   expressJwt = require('express-jwt'),
	   restMiddleware=require('../../middlewares/restmiddleware'),
	   routeskipper=require('../../middlewares/route-skipper'),
	   routeDefaultModifier=require('../../middlewares/routeDefaultModifier');

module.exports = function(app){
  app.use('/api/actionrequests',restMiddleware(db),routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[]), router);
};

router.get('/:userId/ssp/verify', controller.checkSspQualification);
router.get('/:userId/smp/verify', controller.checkSmpQualification);
router.get('/:userId/spp/verify', controller.checkSppQualification);

router.post('/:userId/ssp', controller.postSsp);


router.post('/:userId/smp', controller.postSmp);

router.post('/:userId/spp', controller.postSpp);

router.post('/:userId/holidaypay', controller.postHolidayPay);

router.get('/',controller.getActionRequestData);

router.get('/:id',controller.getActionRequestDataById);

router.patch('/:id/',routeDefaultModifier({params:{status:''}}),controller.updateActionRequest);
router.patch('/:id/:status',controller.updateActionRequest);


router.post('/:userId/studentloan',controller.postStudentLoan);