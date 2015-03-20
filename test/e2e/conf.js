var jasmineReporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter');
var fs = require('fs');
var awsservice=require('./awsservice');


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
    main:['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js','./spec/agency_prefill.js','./spec/search_current_candidate.js'/*,'./spec/candidates.js','./spec/sidebar.js'*/],
  //  main: ['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js'],
    remote: ['./spec/dummy_data.js','./spec/login.js','./spec/search_current_candidate.js','./spec/candidates.js'],
    dummy: ['./spec/dummy_data.js','./spec/login.js','./spec/search_current_candidate.js','./spec/sidebar.js']
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
    var count=0;
    function screenshotProcessor(options) {}

    screenshotProcessor.prototype = new DisplayProcessor();
    screenshotProcessor.prototype.displayFailedSpec = function (spec, log) {
      count++;
      var url='https://originem-payroll-dev.s3.amazonaws.com/screenshots/screenshot-'+count+'.png';
      browser.takeScreenshot().then(function (data) {
       // writeScreenShot(data,path);
       awsservice.putS3Object(new Buffer(data, 'base64'),String(parseInt(new Date().getTime().toString().substr(-9,9)))+'.png','image/png','screenshots/').then(function(str){
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
