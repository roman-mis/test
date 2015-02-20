var helper = require('./ui-helper.js');
loginData.userName=loginData.userName || 'originemtest_t568300';
loginData.userEmail= loginData.userEmail || 'originemtest+t568300@yandex.com';
loginData.userPassword= loginData.userPassword || 'andyboss';


describe('Browse to sign in', function() {
/*var count=0;
  afterEach(function() {
    count++;
    console.log(jasmine.getEnv().currentSpec.description);
    browser.takeScreenshot().then(function (png) {
     helper.writeScreenShot(png, 'exception-'+count+'.png');
     });
  });*/

  var expectValid = function (element) {
    expect(element.getAttribute('class')).toContain('ng-valid');

  };
  var expectInvalid = function (element) {
    expect(element.getAttribute('class')).toContain('ng-invalid');
  };
  var logButton = element(by.css('[ng-click="doLogin()"]'));

  it('should navigate to page with login options ', function () {
    browser.get('/');
  });


  it('should find login button ', function () {
    expect(logButton.isPresent()).toBe(true);
    logButton.click();
  });

  it('should outline in red invalid fields', function () {
    var login = element(by.model('emailAddress'));
    expectInvalid(login);

    var pass = element(by.model('password'));
    expectInvalid(pass);

    console.log('Login details right here ----->');
    console.log(loginData.userEmail);
    console.log(loginData.userPassword);

    login.sendKeys(loginData.userEmail);
    pass.sendKeys(loginData.userPassword);

    logButton.click();

  });


  it('should navigate to candidates page ', function () {
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('candidates') !== -1);
      });
    }, 5000);

  });

});

