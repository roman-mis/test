'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../../models'),
	controller=require('../../controllers/admin/adminExpenseRates')(db),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../../middlewares/restmiddleware'),
	routeskipper=require('../../middlewares/route-skipper');

module.exports = function(app){
  app.use(
        '/api/systems/expensesrates',
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

router.get('/', controller.getExpenseRates);
router.post('/', controller.postExpenseRates);

router.get('/expensesratetype/:expensesRateType', controller.getByExpenseRateType);

router.patch('/:id', controller.patchExpenseRates);