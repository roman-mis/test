'use strict';

var express = require('express'),
    db = require('../models'),
    router = express.Router(),
    controller=require('../controllers/constants')(db);

module.exports = function(app){
  app.use('/api/constants', router);
};

router.get('/nationalities',controller.nationalities);

router.get('/starterdeclarations',controller.starterdeclarations);

router.get('/taxbasis',controller.taxbasis);

router.get('/margins',controller.margins);

router.get('/payfrequencies',controller.payfrequencies);

router.get('/holidaypayrules',controller.holidaypayrules);

router.get('/paymentmethods',controller.paymentmethods);

router.get('/adminfee',controller.adminfee);

router.get('/derogationcontracts',controller.derogationcontracts);

router.get('/communicationmethod',controller.communicationmethod);

router.get('/contractorstatus',controller.contractorstatus);

router.get('/servicesused',controller.servicesused);

router.get('/paymentterms',controller.paymentterms);



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

router.get('/otherexpensetypes',controller.otherexpensetypes);

router.get('/adminTemplatesData/:type',controller.getAdminTemplatesData);

router.get('/adminCompanyProfileData',controller.getAdminCompanyProfileData);

router.get('/fuels',controller.fuels);
router.get('/enginesizes',controller.enginesizes);

router.get('/expensesratetypes',controller.expensesRateTypes);
router.get('/paymentratetypes',controller.paymentRateTypes);

router.get('/timesheettemplates',controller.getTimesheetTemplates);
router.get('/AOE',controller.getAOE);

router.get('/candidateTitle', controller.getCandidateTitle);
router.get('/agencyStatus', controller.getAgencyStatus);
router.get('/candidateStatus', controller.getCandidateStatus);
router.get('/expenseClaimStatus', controller.getExpenseClaimStatus);
router.get('/expenseStatus', controller.getExpenseStatus);
router.get('/timesheetStatus', controller.getTimesheetStatus);

router.get('/profiles/:type/first', controller.getProfileFirst);
router.get('/profiles/:type/permissions', controller.getProfilePermissions);
router.get('/userTypes', controller.getUserTypes);

router.get('/relationships',controller.relationships);
router.get('/slrAgreements', controller.slrAgreements);
router.get('/mileageRatesDefault', controller.mileageRatesDefault);
