exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:9000',
  capabilities: {
    'browserName': 'chrome'
  },
  specs: ['ktest.js'],
  allScriptsTimeout: 500000,
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 900000
  }
};
