module.exports = function () { // needed for call twice

  describe('Browse to sign in', function () {

    var expectValid = function (element) {
      expect(element.getAttribute('class')).toContain('ng-valid');

    };
    var expectInvalid = function (element) {
      expect(element.getAttribute('class')).toContain('ng-invalid');
    };
    var logButton = element(by.css('[ng-click="doLogin()"]'));


    it('should navigate to page with login options ', function () {
      browser.get('/');
      //console.log('navigating into main root page');
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

      console.log('Login details:');
      console.log(loginData.userEmail);
      console.log(loginData.userPassword);

      login.sendKeys(loginData.userEmail);
      pass.sendKeys(loginData.userPassword);

      logButton.click();

    });


    it('should navigate inside the portal', function () {
      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return (url.indexOf('register') == -1);
        });
      }, 20000);

    });

  });



};
