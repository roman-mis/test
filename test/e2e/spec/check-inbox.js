
describe('Checking mailbox', function() {

  it('should navigate to gmail.com',function(){
    browser.driver.get('https://mail.yandex.com/');
  });

  /*
   it('match the proper login page url', function () {
   browser.driver.wait(function () {
   return browser.driver.getCurrentUrl().then(function (url) {
   return (url.indexOf('ServiceLogin') !== -1);
   });
   }, 5000);
   });
   */

  it('should find login button and fill it',function(){
    browser.driver.findElement(by.css('[name="login"]')).sendKeys('originemtest');
    browser.driver.findElement(by.css('[name="passwd"]')).sendKeys('andyboss');
    browser.driver.findElement(by.css('.b-mail-button__button')).click();
  });

  it('should enter lite version', function () {
    browser.driver.get('https://mail.yandex.com/lite/inbox');
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('lite') !== -1);
      });
    }, 7000);
  });

  it('should find new email',function(){
    expect(browser.driver.isElementPresent(by.css('.b-messages .b-messages__message_unread'))).toBeTruthy();
  });



  it('should navigate to open email',function(){
    browser.driver.findElement(by.css('.b-messages .b-messages__message_unread .b-messages__message__link')).click();
  });

  it('should ensure open email', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        console.log(url);
        return (url.indexOf('message') !== -1);
      });
    }, 7000);
  });

  it('should follow emaik link in email',function(){
    browser.driver.findElement(by.css('.b-message-body__content a')).getAttribute('href').then(function(href){
      browser.driver.get(href);
    });
  });

  it('should take user to activate page', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('activate') !== -1);
      });
    }, 7000);
  });


  it('should enter users details', function () {
    element(by.css('.activate-container [name="password"]')).sendKeys('andyboss');
    element(by.css('.activate-container [name="confirmpassword"]')).sendKeys('andyboss');
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


/*

describe('Checking mailbox', function() {

  it('should navigate to gmail.com',function(){
    browser.driver.get('http://gmail.com');
    */
/*    var loginBtn = browser.driver.findElement(by.css('.btn.red'));
     loginBtn.click();*//*

  });

  it('match the proper login page url', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('ServiceLogin') !== -1);
      });
    }, 5000);
  });

  it('should find login button and fill it',function(){
    browser.driver.findElement(by.css('#Email')).sendKeys('originemtest');
    browser.driver.findElement(by.css('#Passwd')).sendKeys('andyboss');
    browser.driver.findElement(by.css('#signIn')).click();
  });

  it('should enter mailbox', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('mail') !== -1);
      });
    }, 7000);
  });

  it('should find new email',function(){
    expect(browser.driver.isElementPresent(by.css('table.th span.ts b'))).toBeTruthy();
  });



  it('should navigate to open email',function(){
    browser.driver.findElement(by.css('table.th tr td a')).click();
  });

  it('should ensure open email', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('th=') !== -1);
      });
    }, 7000);
  });

  it('should follow emaik link in email',function(){
    //  browser.driver.findElement(by.css('div.msg a')).click();
    browser.driver.findElement(by.css('div.msg a')).getAttribute('href').then(function(href){
      browser.driver.get(href);
    });
  });

  it('should take user to activate page', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        console.log('url='+url);
        return (url.indexOf('activate') !== -1);
      });
    }, 7000);
  });


  it('should enter users details', function () {
    element(by.css('.activate-container [name="password"]')).sendKeys('andyboss');
    element(by.css('.activate-container [name="confirmpassword"]')).sendKeys('andyboss');
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

*/
