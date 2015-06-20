var picturePath = require('path').normalize(__dirname + '/../../../sample.png');

describe('changing avatar', function () {
	it('should open site menu', function(){
		element(by.css('span.sitemenu')).click();
	});
	it('should open profile menu', function(){
		element(by.css('[ng-click="myProfile()"]')).click();
	});
	it('should change avatar picture', function(){
		element(by.css('.modal-content input[type="file"]')).sendKeys(picturePath);	
		element(by.css('[ng-click="save()"]')).click();
		helper.alertAccept();
		browser.sleep(1000);
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
		
	});
	it('check if avatar picture is loaded', function(){		
		element(by.css('span.sitemenu')).click();
		element(by.css('[ng-click="myProfile()"]')).click();
		expect(element(by.css('[ng-if="avatar"] img')).getAttribute('ng-src')).toBeTruthy();		
		element(by.css('[ng-click="cancel()"]')).click();
		helper.alertAccept();
		browser.sleep(3000);
	});
}); 
