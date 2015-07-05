

describe('Check candidate email manager', function(){
	
	it('should open email manager dialog', function(){
		element(by.css('[ng-click="openEmailManagerWin()"]')).click();
		
		browser.sleep(2000);
		
		expect(element(by.css('.modal-content')).isDisplayed()).toBeTruthy();
	});
	
	it('sending email message', function(){
		element(by.model('data.emailSubject')).clear().sendKeys('Test Message');
		
		element(by.css('#question')).click();
		
		element(by.css('#question')).clear().sendKeys('Testing email manager service');
		
		expect(element(by.css('[ng-click="send()"]')).isEnabled()).toBeTruthy();
		
		element(by.css('[ng-click="send()"]')).click();
		
		helper.alertAccept();
		
		browser.sleep(2000);
		
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
	});
	
});
 
