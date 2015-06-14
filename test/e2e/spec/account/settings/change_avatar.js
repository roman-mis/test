var picturePath = require('path').normalize(__dirname + '../../../sample.png');

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
		browser.sleep(50);
		expect(element(by.css('.alert-success')).isPresent()).toBeTruthy();
		browser.sleep(100);
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
	});
}); 
