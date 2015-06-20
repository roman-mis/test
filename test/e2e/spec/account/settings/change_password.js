var oldPassword;

var testPassword = 'originemtestpassword'

describe('password change setup', function(){
	it('set test password "' + testPassword + '"', function(){
		oldPassword = loginData.userPassword;
		loginData.userEmail = loginData.userEmail.replace('+','_');
		loginData.userPassword = testPassword;
		console.log('saving old password', oldPassword);
	});
});

describe('changing password', function () {
	
	
	it('should open site menu', function(){
		element(by.css('span.sitemenu')).click();
	});
	it('should open profile menu', function(){
		element(by.css('[ng-click="myProfile()"]')).click();
	});
	it('typing old and new passwords ("'+testPassword+'")', function(){
		element(by.model('profile.password')).sendKeys(oldPassword);
		element(by.model('profile.newPassword')).sendKeys(testPassword);
	});
	it('typing different password in confirm password field (should throw alert message)', function(){			
		element(by.model('profile.confirmPassword')).sendKeys(testPassword+'not_matched');
		expect(element(by.css('.modal-content .alert-danger.ng-hide')).isPresent()).toBeFalsy();
		element(by.model('profile.confirmPassword')).clear().sendKeys(testPassword);
		expect(element(by.css('.modal-content .alert-danger.ng-hide')).isPresent()).toBeTruthy();
	});
	it('should change password', function(){		
		element(by.css('[ng-click="save()"]')).click();
		helper.alertAccept();
		browser.sleep(1000);
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
	});
}); 

describe('loging out to test account with new password', function(){
	
});

helper.execScript(__dirname + '/../login/logout.js');

helper.execScript(__dirname + '/../login/login1.js');

describe('restore back old password (for future tests=)', function () {
	
	
	it('should open site menu', function(){
		element(by.css('span.sitemenu')).click();
	});
	it('should open profile menu', function(){
		element(by.css('[ng-click="myProfile()"]')).click();
	});
	it('typing old and new passwords', function(){
		console.log('test password was:', testPassword);
		console.log('old password was:', oldPassword);
		element(by.model('profile.password')).sendKeys(testPassword);
		element(by.model('profile.newPassword')).sendKeys(oldPassword);
		element(by.model('profile.confirmPassword')).sendKeys(oldPassword);
	});
	it('should change password', function(){		
		element(by.css('[ng-click="save()"]')).click();
		helper.alertAccept();
		browser.sleep(1000);
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
	});
}); 




