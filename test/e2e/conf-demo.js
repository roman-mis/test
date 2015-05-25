var jasmineReporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter');
var fs = require('fs');
var awsservice=require('./awsservice');

var adminCredentials=['./spec/login/admin_data.js'];
var userCredentials=['./spec/login/user_data.js'];


var regNewUser=[
  './spec/reg/reg.js',
  './spec/reg/check-inbox.js',
  './spec/reg/activate.js'
];

var login1=['./spec/login/login1.js'];
var login2=['./spec/login/login2.js'];

var logout=['./spec/login/logout.js'];

var accountSetup=[
 './spec/account/change_password.js'
];

var candidateTabs=[
  './spec/candidate/search_current_candidate.js',
  './spec/candidate/home_tab.js',
  './spec/candidate/contact_tab.js',
  './spec/candidate/payroll_tax_tab.js',
  './spec/candidate/payroll_product_tab.js',
  './spec/candidate/agencies_tab.js',
  './spec/candidate/check_admin_tabs.js',
];
var candidateSidebar=[

  /* Working*/
  './spec/candidate/sidebar/dpa.js',
  './spec/candidate/sidebar/add_call_log.js',
  './spec/candidate/sidebar/expense_wizard.js',
  './spec/candidate/sidebar/manual_expenses.js',
  './spec/candidate/sidebar/agencies.js'

  /* Not Working */
//  './spec/candidate/sidebar/onboarding.js',
  //'./spec/candidate/sidebar/activity.js',

];
var prefill=[
  './spec/admin/payment_rate.js',
  './spec/admin/expense_rate.js',
  './spec/agency/agency_prefill.js',
];

var test=[
  './spec/candidate/search_current_candidate.js',
  // './spec/candidate/margin_tab.js',
]


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
    main: regNewUser.concat(login1).concat(logout).concat(adminCredentials).concat(login2).concat(prefill).concat(candidateTabs),
    remote: adminCredentials.concat(login1).concat(candidateTabs),
    account_setup: adminCredentials.concat(login1).concat(accountSetup).concat(logout),
    //dummy: regNewUser.concat(login).concat(logout).concat(adminCredentials).concat(login).concat(prefill).concat(candidateTabs).concat(candidateSidebar)
    dummy: regNewUser.concat(login1).concat(logout).concat(adminCredentials).concat(login2).concat(prefill).concat(candidateTabs)//.concat(candidateSidebar)
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
    defaultTimeoutInterval: 60000,
    print: function() {}
  }

};
