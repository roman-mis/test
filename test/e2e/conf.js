var jasmineReporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter');
var fs = require('fs');
var awsservice=require('./awsservice');

var adminCredentials=['./spec/login/admin_data.js'];

var regNewUser=[
  './spec/reg/reg.js',
  './spec/reg/check-inbox.js',
  './spec/reg/activate.js'
];
var login=['./spec/login/login.js']
var logout=['./spec/login/logout.js'];

var candidateTabs=[
  './spec/candidate/search_current_candidate.js',
//  './spec/candidate/check_admin_tabs.js',
//  './spec/candidate/home_tab.js',
 // './spec/candidate/payroll_tax_tab.js',
  './spec/candidate/payroll_product_tab.js',
  './spec/candidate/agencies_tab.js',
];
var candidateSidebar=[
//  './spec/candidate/sidebar/dpa.js',
//  './spec/candidate/sidebar/onboarding.js',
//  './spec/candidate/sidebar/add_call_log.js',
  //'./spec/candidate/sidebar/activity.js',
//  './spec/candidate/sidebar/agencies.js',
];
var prefill=[
//  './spec/admin/payment_rate.js',
  './spec/admin/expense_rate.js',
];



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
    main: regNewUser.concat(login).concat(logout),
  //  main: ['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js'],
    remote: adminCredentials.concat(login).concat(prefill),
    dummy: []
  },

  onPrepare: function () {

    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: 'protractor-results',
      consolidateAll: false
    }));
  //  jasmine.getEnv().addReporter(new jasmineReporters.TerminalReporter({verbosity: 3}));

    // browser.driver.manage().window().maximize();
    browser.driver.manage().window().setSize(1050,850);
    browser.driver.manage().window().setPosition(0,0);

    global.loginData={
      userEmail:'',
      userPassword:'',
      userName:'',
      userSurname:''
    };

    /* SCREENSHOT SECTION START*/
   /* var dir = './test/e2e/screenshots';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    var writeScreenShot=function (data, path) {
      var stream = fs.createWriteStream('./'+path);
      stream.write(new Buffer(data, 'base64'));
      stream.end();
    }*/


    var DisplayProcessor = require('./../../node_modules/jasmine-spec-reporter/src/display-processor');
    function screenshotProcessor(options) {}

    screenshotProcessor.prototype = new DisplayProcessor();
    screenshotProcessor.prototype.displayFailedSpec = function (spec, log) {

      var number=String(parseInt(new Date().getTime().toString().substr(-9,9)));
      var url='https://originem-payroll-dev.s3.amazonaws.com/screenshots/'+number+'.png';
      browser.takeScreenshot().then(function (data) {
       // writeScreenShot(data,path);
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
