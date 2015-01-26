'use strict';

var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
	db = require('../models'),
	router = express.Router(),
	controller=require('../controllers/agency')(db),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	routeskipper=require('../middlewares/route-skipper')
	
;
var awsservice=require('../services/awsservice');

module.exports = function(app){
  app.use('/api/agencies',routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[]), router);
};

/* Agency */
router.get('/',restMiddleware(db),controller.getAllAgency);
router.get('/:id',controller.getAgency);
router.post('/', controller.postAgency);
router.patch('/:id', controller.patchAgency);

/* Branch */
router.get('/:id/branches',controller.getBranches);
router.get('/branches/:id',controller.getBranch);
router.post('/:id/branches',controller.postBranch);
router.patch('/branches/:id',controller.patchBranch);
router.delete('/branches/:id',controller.deleteBranch);

/* Consultant */
router.get('/branches/:branchid/consultants',controller.getConsultants);
router.get('/consultants/:id',controller.getConsultant);
router.post('/branches/:branchid/consultants',controller.postConsultant);
router.patch('/consultants/:id',controller.patchConsultant);
router.delete('/consultants/:id',controller.deleteConsultant);

/* Contact Information */
router.get('/:id/contact',controller.getAgencyContact);
router.patch('/:id/contact',controller.patchAgencyContact);

/* Payroll Tab */
router.get('/:id/payroll',controller.getAgencyPayroll);
router.patch('/:id/payroll',controller.patchAgencyPayroll);

/* Sales Tab */
router.get('/:id/sales',controller.getAgencySales);
router.patch('/:id/sales',controller.patchAgencySales);

router.get('/:id/logosignedurl',controller.getAgencyLogoUploadSignedUrl);
router.get('/:id/file_signed_url/:fileName',controller.getFileSignedUrl);
router.get('/:id/file_redirect_url/:fileName',controller.getFileRedirectUrl);
router.patch('/consultants/:id/lockunlock/:flag',controller.lockUnlockConsultant);
router.post('/consultants/:id/changepassword',controller.changeConsultantPassword);
