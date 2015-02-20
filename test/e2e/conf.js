var jasmineReporters = require('jasmine-reporters');



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
    main:['./spec/login_data.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js','./spec/sidebar.js'],
  //  main: ['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js'],
    remote:  ['./spec/login_data.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js','./spec/sidebar.js'],
    dummy: ['./spec/dummy_data.js','./spec/login.js'/*,'./spec/candidates.js','./spec/sidebar.js'*/]
  //  dummy: './spec/dummy.js'
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

    var fs = require('fs');
    var writeScreenShot=function (data, filename) {
      var path='/test/e2e/screenshots/'+String(parseInt(new Date().getTime().toString().substr(-9,9)))+'.png';
      var stream = fs.createWriteStream('.'+path);
      stream.write(new Buffer(data, 'base64'));
      stream.end();
      console.log(browser.baseUrl+path);
    }

    var DisplayProcessor = require('./../../node_modules/jasmine-spec-reporter/src/display-processor');

    function screenshotProcessor(options) {
    }
    screenshotProcessor.prototype = new DisplayProcessor();

    screenshotProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
      browser.takeScreenshot().then(function (png) {
        writeScreenShot(png);
      });
      return log;
    };
    screenshotProcessor.prototype.displayFailedSpec = function (spec, log) {
      return spec + " - " + log;
    };

    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({ customProcessors: [screenshotProcessor],displayStacktrace: true}));



  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  }

};
