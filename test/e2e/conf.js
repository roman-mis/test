var jasmineReporters = require('jasmine-reporters');

exports.config = {

  framework: 'jasmine2',

  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:9000',
  capabilities: {
    'browserName': 'chrome'
  },
  suites: {
    main:['./spec/reg.js','./spec/check-inbox.js'],
    reg: './spec/reg.js',
    login: './spec/login.js',
    candidates: ['./spec/login.js','./spec/candidates.js'],
    sidebar: ['./spec/login.js','./spec/sidebar.js'],
    test: ['./spec/dummy.js']
  },

  onPrepare: function () {
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: 'protractor-results',
      consolidateAll: false
    }));
    jasmine.getEnv().addReporter(new jasmineReporters.TerminalReporter({verbosity: 3}));
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  }

};
