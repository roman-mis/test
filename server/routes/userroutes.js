'use strict';

var express = require('express'),
    jwt = require('jsonwebtoken'),
    
    router = express.Router(),
    expressJwt = require('express-jwt'),
    db = require('../models'),
    controller=require('../controllers/users')(db),
    restMiddleware=require('../middlewares/restmiddleware'),
	routeskipper=require('../middlewares/route-skipper')
  ;


module.exports = function(app){
  app.use('/api/users', routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[
  	{path:/\/api\/users\/activation\/\w+/},{path:/\/api\/users\/emailvalidation\/\w+/},
    {path:/\/api\/users\/changepassword\/\w+/}]), router);
};

router.get('/',restMiddleware(db),controller.getAllUsers);

router.get('/activation/:email_address',controller.getActivation);

router.post('/activation/:email_address',controller.postActivation);

router.post('/:id/lockunlock/:flag',controller.lockunlock);

router.get('/emailvalidation/:email_address',controller.emailValidation);

router.get('/changepassword/verify/:email_address/:code',controller.verifyChangePassword);

router.post('/changepassword/:email_address/:code',controller.changePassword);