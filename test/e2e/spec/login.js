

describe('Browse to sign in', function() {

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


  it('should find reg button ', function () {
    expect(logButton.isPresent()).toBe(true);
    logButton.click();
  });

  it('should outline in red invalid fields', function () {
    var login = element(by.model('emailAddress'));
    expectInvalid(login);

    var pass = element(by.model('password'));
    expectInvalid(pass);

    login.sendKeys('ishwor@makeitsimple.info');
    pass.sendKeys('passw0rd');

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

