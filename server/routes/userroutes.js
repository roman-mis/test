'use strict';

var express = require('express'),
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

router.get('/:id',controller.getUser);

router.get('/activation/:emailAddress',controller.getActivation);

router.post('/activation/:emailAddress',controller.postActivation);

router.post('/:id/lockunlock/:flag',controller.lockunlock);

router.get('/emailvalidation/:emailAddress',controller.emailValidation);

router.get('/changepassword/verify/:emailAddress/:code',controller.verifyChangePassword);

router.post('/changepassword/:emailAddress/:code',controller.changePassword);

router.patch('/:id', controller.patchUser);
