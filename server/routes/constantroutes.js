'use strict';

var express = require('express'),
    jwt = require('jsonwebtoken'),
    db = require('../models'),
    router = express.Router(),
    controller=require('../controllers/constants')(db),
    aws = require('aws-sdk'),
    mailer=require('../mailing/mailer'),
    path=require('path'),
    expressJwt = require('express-jwt'),
    awsService=require('../services/awsservice');
var bcrypt=require('bcryptjs');
var utils=require('../utils/utils');

module.exports = function(app){
  app.use('/api/constants', router);
};

router.get('/nationalities',controller.nationalities);

router.get('/starterdeclarations',controller.starterdeclarations);

router.get('/payfrequencies',controller.payfrequencies);

router.get('/taxbasis',controller.taxbasis);

router.get('/margins',controller.margins);

router.get('/holidaypayrules',controller.holidaypayrules);

router.get('/derogationcontracts',controller.derogationcontracts);

router.get('/servicesused',controller.servicesused);

router.get('/paymentterms',controller.paymentterms);

router.get('/paymentmethods',controller.paymentmethods);


router.get('/holidays',controller.holidays);

router.get('/vehicletypes',controller.vehicletypes);

router.get('/priorities',controller.priorities);

router.get('/calllogtasktypes',controller.calllogtasktypes);

router.get('/statuses',controller.statuses);

router.get('/createtasktypes',controller.createtasktypes);

router.get('/documenttypes',controller.holidays);

router.get('/marginexceptiontypes',controller.marginexceptiontypes);

router.get('/reasons',controller.reasons);

router.get('/deductiontypes',controller.deductiontypes);

router.get('/agencytypes',controller.agencytypes);

router.get('/invoicemethods',controller.invoicemethods);

router.get('/statuslist',controller.statuslist);

router.get('/countries',controller.countries);

router.get('/margintypes',controller.margintypes);

router.get('/roleslist',controller.roleslist);

router.get('/mealslist',controller.mealslist);

router.get('/transportationmeans',controller.transportationmeans);