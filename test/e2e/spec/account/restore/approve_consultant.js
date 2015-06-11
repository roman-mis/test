
describe('Approve Consultant by Mail', function(){

	it('should navigate to mail.yandex.com and redirect to passport', function () {
	  
      browser.driver.get('https://mail.yandex.com/lite/inbox');
      browser.sleep(3000);
    /*  browser.driver.wait(function () {
        return browser.driver.isElementPresent(by.css('[name="login"]')).then(function (bool) {
          return bool;
        });
      }, 120000);*/
  });


	it('should find login button and fill it', function () {
		browser.driver.findElement(by.css('[name="login"]')).sendKeys('originemrestore');
		browser.driver.findElement(by.css('[name="passwd"]')).sendKeys('originemtester');
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
	
	// !! No idea why "no such element" is there? Code "$('.b-message-subject').text()" works perfectly in browser's console...
	//it('check message subject', function(){
	//	browser.sleep(15000);
	//	
	//	browser.driver.findElement(by.css('.js-message-subject')).getText().then(function(v){
	//		console.log('subject: ', v);
	//	});
	//});
	
	it('should follow email link in email & deleting email', function () {
		browser.driver.findElement(by.css('.b-message-body__content a')).getAttribute('href').then(function (href) {
			browser.driver.findElement(by.css('.b-toolbar__i [name="delete"]')).click();
			browser.driver.get(href);
		});
	});
});

describe('Set up new password for Consultant', function(){
	it('submit password', function(){
		element(by.css('.activate-container [ng-model="password"]')).sendKeys('originemtester');
		element(by.model('confirmPassword')).sendKeys('originemtester');
		expect(element(by.css('.alert-danger')).isDisplayed()).toBeFalsy();	
		
		element(by.css('[ng-click="submit()"]')).click();	
	});
	
	it('should redirect to login page', function(){
		browser.wait(function(){
			return browser.driver.getCurrentUrl().then(function(url){
				return /register\/home/.test(url);
			});
		});
		
	});
});

describe('Using "Consultant" login details', function() {
  it('setting up "Consultant" login details', function () {
    loginData.userName = 'Originem';
    loginData.userSurname = 'Restore';
    loginData.userEmail = 'originemrestore@yandex.com';
    loginData.userPassword = 'originemtester';
  });
});

