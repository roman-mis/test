describe('changing password', function () {
	var newPassword = loginData.userPassword == 'z3c1x2'  ? 'z3c1x2' /* 1st time: change to test password */ : 'z3c1x2' /* 2nd time: set back to old password */;
	
	it('should open site menu', function(){
		element(by.css('span.sitemenu')).click();
	});
	it('should open profile menu', function(){
		element(by.css('[ng-click="myProfile()"]')).click();
	});
	it('typing old and new passwords ("'+newPassword+'")', function(){
		element(by.model('profile.password')).sendKeys(loginData.userPassword);
		element(by.model('profile.newPassword')).sendKeys(newPassword);
	});
	it('typing different password in confirm password field (should throw alert message)', function(){			
		element(by.model('profile.confirmPassword')).sendKeys(newPassword+'not_matched');
		element(by.css('.modal-content .alert-danger')).getAttribute('class').then(function(attr){
			expect((attr||'').split(/\s+/g).indexOf('ng-hide')).toBe(-1);
		});
		element(by.model('profile.confirmPassword')).clear().sendKeys(newPassword);
		element(by.css('.modal-content .alert-danger')).getAttribute('class').then(function(attr){
			expect((attr||'').split(/\s+/g).indexOf('ng-hide')).not.toBe(-1);
		});
	});
	it('should change password', function(){
		loginData.userPassword = newPassword; // "change password" (set new password) -> "log out" -> "log in" -> "change password" (restore old one)
		element(by.css('[ng-click="save()"]')).click();
		helper.alertAccept();
		browser.sleep(100);
		expect(element(by.css('.alert-success')).isPresent()).toBeTruthy();
		browser.sleep(100);
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
	});
}); 
