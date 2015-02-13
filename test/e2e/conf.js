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
   // main:['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js'],
    main: ['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js'],
    stage: ['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js'],
    remote: ['./spec/dummy_data.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js'],
  //  dummy: ['./spec/dummy_data.js','./spec/login.js','./spec/agency_prefill.js','./spec/candidates.js'/*,'./spec/sidebar.js'*/]
  //  dummy: './spec/dummy.js'
  },

  onPrepare: function () {
   // browser.driver.manage().window().maximize();
    browser.driver.manage().window().setSize(1050,850);
    browser.driver.manage().window().setPosition(0,0);
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: 'protractor-results',
      consolidateAll: false
    }));
    jasmine.getEnv().addReporter(new jasmineReporters.TerminalReporter({verbosity: 3}));

    global.loginData={
      userEmail:'',
      userPassword:'',
      userName:'',
      userSurname:''
    }
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  }

};
