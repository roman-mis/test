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
router.get('/:id/marginFee',controller.getUserMarginFee);
router.patch('/marginFee/:id',controller.updateUserMarginFee);
router.patetch('/marginFees/:ids',controller.getMarginsByCandidateIds);

router.get('/activation/:emailAddress',controller.getActivation);

router.post('/update/:id',controller.updateUser);

router.post('/activation/:emailAddress',controller.postActivation);

router.post('/:id/lockunlock/:flag',controller.lockunlock);

router.get('/emailvalidation/:emailAddress',controller.emailValidation);

router.get('/changepassword/verify/:emailAddress/:code',controller.verifyChangePassword);
router.get('/resetpassword/verify/:emailAddress/:code',controller.verifyResetPassword);

router.post('/changepassword/:emailAddress/:code',controller.changePassword);

router.get('/send/passwardReset/:id',controller.sendPasswardReset);

router.patch('/:id', controller.patchUser);
