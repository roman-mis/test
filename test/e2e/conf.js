var jasmineReporters = require('jasmine-reporters');

exports.config = {

  framework: 'jasmine2',

  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:9000',
  capabilities: {
    'browserName': 'chrome'
  },
  suites: {
    main:['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js'],
    stage: ['./spec/reg.js','./spec/check-inbox.js','./spec/activate.js','./spec/login.js'],
    remote: ['./spec/dummy_data.js','./spec/login.js'],
    dummy: ['./spec/login.js','./spec/candidates.js'/*,'./spec/sidebar.js'*/]
  },

  onPrepare: function () {
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
