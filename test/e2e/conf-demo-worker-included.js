var jasmineReporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter');
var fs = require('fs');
var awsservice=require('./awsservice');

var adminCredentials=['./spec/account/login/admin_data.js'];
var userCredentials=['./spec/account/login/user_data.js'];

var logger = require('./spec/test-debug-logger.js');

global.DEBUG_TEST = true;


var regNewUser=[
  './spec/account/reg/reg.js',
  './spec/account/reg/check-inbox.js',
  './spec/account/reg/activate.js'
];

var login1=['./spec/account/login/login1.js'];
var login2=['./spec/account/login/login2.js'];
var logout=['./spec/account/login/logout.js'];




/* ***************** ADMIN TAB ****************************/

var companyProfile=[
  './spec/admin/companyProfile/companyProfileContact.js',
  './spec/admin/companyProfile/companyProfileAccounts.js',
  './spec/admin/companyProfile/companyProfileBankDetails.js',
  './spec/admin/companyProfile/companyProfileDefaults.js',
];

var userManagment=[
  './spec/admin/users/update_user_info.js'
];

var templateManagment=[
  './spec/admin/templates/template_helper.js',
  './spec/admin/templates/call_log.js',
  './spec/admin/templates/task.js',
  './spec/admin/templates/document.js',
  './spec/admin/templates/email.js',
  './spec/admin/templates/payslip.js',
  './spec/admin/templates/invoice.js',
  './spec/admin/templates/_extras.js',
];
var HRMC=[
  './spec/admin/hrmc/rti_submissions.js',
  './spec/admin/hrmc/mileage_rates.js',
  './spec/admin/hrmc/cis_verification.js',
];

var adminRates=[
//  './spec/admin/statutory_rate.js',
  './spec/admin/payment_rate.js',
 // './spec/admin/expense_rate.js',
];

///combining admin tabs together
var adminTab=companyProfile.concat(userManagment).concat(templateManagment).concat(HRMC).concat(adminRates);



/*************************** AGENCY *****************************/
var agencyTab=[
  './spec/agency/agency_prefill.js',
  './spec/agency/check_agency.js',
  './spec/agency/tabs/consultants.js'
]

/************************** ACCOUNT SETTINGS **********************/
var accountSettings=[
  './spec/account/settings/change_avatar.js',
  './spec/account/settings/change_password.js',
  //'./spec/account/settings/vehicle_info.js',
];


/*************************** Activity ******************************/
var activity=[
  //'./spec/activity/expenses_authorisation.js',
];


/* CANDIDATES TAB */
var candidateTabs=[
  './spec/candidate/search_current_candidate.js',
  './spec/candidate/home_tab.js',
  //'./spec/candidate/margin_tab.js',
  './spec/candidate/contact_tab.js',
  './spec/candidate/payroll_tax_tab.js',
  './spec/candidate/payroll_product_tab.js',
  //'./spec/candidate/agencies_tab.js',
  //'./spec/candidate/check_admin_tabs.js',
];
var candidateSidebar=[
  './spec/candidate/sidebar/dpa.js',
  './spec/candidate/sidebar/add_call_log.js',
  './spec/candidate/sidebar/expense_wizard.js',
  //'./spec/candidate/sidebar/manual_expenses.js',
  './spec/candidate/sidebar/agencies.js',
  './spec/candidate/sidebar/activity.js',
  './spec/candidate/sidebar/action_requests.js',
  './spec/candidate/sidebar/timesheet.js',
];
/*
 * General flow:
 * Register new user and login him in and logout
 * Change credentials to admin user
 * Check account settings
 * Checking system preferences from admin tab
 * Checking agencies
 * Checking candidates
 * Checking activity tab
 *
 * */

var test=[
  './spec/candidate/search_current_candidate.js',
  './spec/candidate/search_current_candidate.js',
]

/* ----------------------- CONFIG --------------------------- */
exports.config = {

  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:9000',
  capabilities: {
    'browserName': 'chrome'
  },
  /*  multiCapabilities: [{
   'browserName': 'chrome'
   }, {
   'browserName': 'chrome'
   }],*/
  suites: {
    main: regNewUser.concat(login1).concat(logout).concat(adminCredentials)
      .concat(login2).concat(accountSettings).concat(adminTab).concat(agencyTab)
      .concat(candidateTabs).concat(candidateSidebar).concat(activity).concat(['./spec/account/worker/index.js'/*,'./spec/account/consultant/index.js'*/]),
    remote: adminCredentials.concat(login1).concat(candidateTabs).concat(candidateSidebar),
    reguser: regNewUser.concat(login1).concat(logout),
    worker: ['./spec/account/worker/index.js'],
    dummy:  adminCredentials.concat(login1).concat(HRMC).concat(logout).map(logger.wrapper)//.concat(['./spec/account/worker/index.js','./spec/account/consultant/index.js'])
  },

  onPrepare: function () {

    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: 'protractor-results',
      consolidateAll: false
    }));

    // browser.driver.manage().window().maximize();
    browser.driver.manage().window().setSize(1050,850);
    browser.driver.manage().window().setPosition(0,0);

    global.loginData={
      userEmail:'',
      userPassword:'',
      userName:'',
      userSurname:''
    };

    global.helper=require('./spec/ui-helper.js');

    /* SCREENSHOT SECTION START*/
    var DisplayProcessor = require('./../../node_modules/jasmine-spec-reporter/src/display-processor');
    function screenshotProcessor(options) {}

    screenshotProcessor.prototype = new DisplayProcessor();
    screenshotProcessor.prototype.displayFailedSpec = function (spec, log) {

      var number=String(parseInt(new Date().getTime().toString().substr(-9,9)));
      var url='https://originem-payroll-dev.s3.amazonaws.com/screenshots/'+number+'.png';
      browser.takeScreenshot().then(function (data) {
        awsservice.putS3Object(new Buffer(data, 'base64'),number+'.png','image/png','screenshots/').then(function(str){
          url=str;
        })
      });
      return log+'\r\n'+url;
    };
    jasmine.getEnv().addReporter(new SpecReporter({ customProcessors: [screenshotProcessor]/*,displayStacktrace: true*/}));
    /* SCREENSHOT SECTION END*/

  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    print: function() {}
  }

};
