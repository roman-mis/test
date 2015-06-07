describe('"Admin / Users" > update user info', function() {

    var userRow = element.all(by.repeater('item in allData')).get(0);
    var lockUnlockBtn = userRow.element(by.css('[ng-click="lockUnlock($index)"]'));
    var userRow_name = userRow.element(by.css('td:nth-child(1)'));

	it('Getting Users url', function () {
		browser.get('/admin/users');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('users') !== -1);
			});
		});
	});
	
	it('check if "lock/unlock user"	works', function(){
						
		var isLocked;
		
		lockUnlockBtn.element(by.css('.fa-lock.ng-hide')).isPresent().then(function(b){
			isLocked = !b;
		});
		
		browser.wait(function(){
			lockUnlockBtn.click();
			expect(lockUnlockBtn.element(by.css('.fa-lock.ng-hide')).isPresent())['toBe' + (!isLocked?'Falsy':'Truthy')]();
			browser.refresh();			
			
			expect(lockUnlockBtn.element(by.css('.fa-lock.ng-hide')).isPresent())['toBe' + (!isLocked?'Falsy':'Truthy')](); // check if saved
			
			!isLocked && lockUnlockBtn.click(); // unlock for next test (update user info)
			return true;
		});
	});
	
	it('check if "edit user info" works', function(){
		
		var number = helper.getDefaultNumber();
		
		userRow.element(by.css('[ui-sref="app.admin.user.home({id:item._id})"]')).click();
		
		//! 'wait for url change'
		browser.wait(function(){
			return browser.getCurrentUrl().then(function (url) {
				//console.log(url, /user\/[a-f\d]{16}\/home/.test(url));
				return /user\/[a-f\d]{24}\/home/.test(url);
			});			
		}, 5000);
		
		element(by.model('user.firstName')).clear().sendKeys('originemtest_t' + number);
		element(by.model('user.lastName')).clear().sendKeys('Tester_' + number);
		element(by.model('user.emailAddress')).clear().sendKeys('originemtest+t' + number + '@yandex.com');
		
		helper.selectSimpleSelect(element(by.model('user.userType')), 0);
		
		$('[ng-click="update()"]').click();		
		
		browser.refresh();
		
		//! 'check if saved (using edit page)'
		
		expect(element(by.model('user.firstName')).getAttribute('value')).toBe('originemtest_t' + number);
		expect(element(by.model('user.lastName')).getAttribute('value')).toBe('Tester_' + number);
		expect(element(by.model('user.emailAddress')).getAttribute('value')).toBe('originemtest+t' + number + '@yandex.com');
		
		//! 'check if saved (using users page)'
		
		expect(element(by.model('user.userType')).getAttribute('value')).toBe('0');
		
		browser.get('/admin/users');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return /users$/.test(url);
			});
		});
		
		//! ' check name'
		expect(userRow.element(by.css('td:nth-child(1)')).getText()).toBe('originemtest_t' + number + ' Tester_' + number);
		//! ' check email'
		expect(userRow.element(by.css('td:nth-child(2)')).getText()).toBe('originemtest+t' + number + '@yandex.com');
		
		
		
	});
	
}); 
