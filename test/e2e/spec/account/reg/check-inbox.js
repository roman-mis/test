var userEmail=null;
var userPassword='andyboss';
describe('Navigating to mailbox', function() {

  it('should navigate to mail.yandex.com and redirect to passport', function () {
    browser.driver.get('https://mail.yandex.com/lite/inbox');

    browser.driver.wait(function () {
      return browser.driver.isElementPresent(by.css('[name="login"]')).then(function (bool) {
        return bool;
      });
    }, 30000);
  });
});
  describe('Checking mailbox', function() {
  it('should find login button and fill it', function () {
    browser.driver.findElement(by.css('[name="login"]')).sendKeys('originemtest');
    browser.driver.findElement(by.css('[name="passwd"]')).sendKeys('andyboss');
    browser.driver.findElement(by.css('.action-button')).click();
  });

  it('ensure we are /lite/ url in', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('lite') !== -1);
      });
    }, 20000);
  });


	/* https://github.com/juliemr/webdriverjs-retry RETRY LIB TODO */

  it('mailbox is completelly loaded', function () {
    browser.driver.wait(function () {
      return  browser.driver.isElementPresent(by.css('.b-messages')).then(function(bool){
        return bool;
      });
    },10000);
  });

  it('should find unread emails', function () {
    expect(browser.driver.isElementPresent(by.css('.b-messages .b-messages__message_unread'))).toBeTruthy();
  });

  it('we would try to open unread email', function () {
    browser.driver.findElement(by.css('.b-messages .b-messages__message_unread .b-messages__message__link')).click();

    //if messages where folded in url is "thread"
    browser.driver.getCurrentUrl().then(function (url) {
      if(url.indexOf('thread') !== -1){
        browser.driver.findElement(by.css('.b-messages__message__link')).click();
      }
    });

  });

  it('should ensure unread email is opened', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('message') !== -1);
      });
    }, 7000);
  });

  it('should follow email link in email & deleting email', function () {
    browser.driver.findElement(by.css('.b-message-body__content a')).getAttribute('href').then(function (href) {
      browser.driver.findElement(by.css('.b-toolbar__i [name="delete"]')).click();
      browser.driver.get(href);
    });
  });

  it('should redirect user to activate page', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('activate') !== -1);
      });
    }, 7000);
  });

});


