'use strict';

var express = require('express'),
    router = express.Router(),
	db = require('../../models'),
	controller=require('../../controllers/admin/adminExpenseRates')(),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../../middlewares/restmiddleware'),
	routeskipper=require('../../middlewares/route-skipper');

module.exports = function(app){
  app.use(
        '/api/admin/expenseRates',
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
router.post('/', controller.saveExpenseRates);