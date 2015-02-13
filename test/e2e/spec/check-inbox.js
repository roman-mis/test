var userEmail=null;
var userPassword='andyboss';
describe('Checking mailbox', function() {

  it('should navigate to mail.yandex.com', function () {
    browser.driver.get('https://mail.yandex.com/');
  });


  it('should find login button and fill it', function () {
    browser.driver.findElement(by.css('[name="login"]')).sendKeys('originemtest');
    browser.driver.findElement(by.css('[name="passwd"]')).sendKeys('andyboss');
    browser.driver.findElement(by.css('.b-mail-button__button')).click();
  });

  it('waiting full version to be loaded', function () {
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('neo2') !== -1);
      });
    }, 5000);
  });
/*
  it('should enter lite version', function () {
    browser.driver.get('https://mail.yandex.com/lite/inbox');
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('lite') !== -1);
      });
    }, 7000);
  });*/
  it('should enter lite version', function () {
    browser.driver.get('https://mail.yandex.com/lite/inbox');

    var time=new Date();
    browser.driver.wait(function(){
      return browser.driver.getCurrentUrl().then(function (url) {
        console.log(url);
        if(new Date() - time>7000){
          time=new Date();
          browser.driver.get('https://mail.yandex.com/lite/inbox');
          console.log('reloading browser..');
        }
        return (url.indexOf('lite') !== -1);
      });
    }, 22000)
  });


  it('element with emails should appear', function () {
    browser.driver.wait(function () {
      return  browser.driver.isElementPresent(by.css('.b-messages')).then(function(bool){
        return bool;
      });
    },10000);
  });

  it('should find new email', function () {
    expect(browser.driver.isElementPresent(by.css('.b-messages .b-messages__message_unread'))).toBeTruthy();
  });

  it('should navigate to open email', function () {
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

  it('should follow emaik link in email & deleting email', function () {
    browser.driver.findElement(by.css('.b-message-body__content a')).getAttribute('href').then(function (href) {
      browser.driver.findElement(by.css('.b-toolbar__i [name="delete"]')).click();
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

});


