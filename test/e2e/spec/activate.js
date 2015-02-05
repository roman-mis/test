
describe('Activate user', function() {
  it('submiting users details', function () {

    element(by.css('.activate-container .lead')).getText().then(function(email){
      loginData.userEmail=email;
    });
    element(by.css('.activate-container [name="password"]')).sendKeys(loginData.userPassword);
    element(by.css('.activate-container [name="confirmpassword"]')).sendKeys(loginData.userPassword);
    element(by.css('.activate-container [ng-click="submit()"]')).click();
  });

  it('should take to home page:complete activation', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('home') !== -1);
      });
    }, 7000);
  });

});
