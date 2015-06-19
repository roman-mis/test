describe('"Admin / Users" > check if is worker', function() {

    var userRow = element.all(by.repeater('item in allData')).get(0);

	it('Getting Users url', function () {
		browser.get('/admin/users');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('users') !== -1);
			});
		});
	});
	
	it('check if registered user account type = Worker', function(){
		
		var number = helper.getDefaultNumber();
		
		userRow.element(by.css('[ui-sref="app.admin.user.home({id:item._id})"]')).click();
		
		//! 'wait for url change'
		browser.wait(function(){
			return browser.getCurrentUrl().then(function (url) {
				//console.log(url, /user\/[a-f\d]{16}\/home/.test(url));
				return /user\/[a-f\d]{24}\/home/.test(url);
			});			
		}, 5000);
		
		expect(element(by.model('user.userType')).getAttribute('value')).toBe('0');
		expect(element(by.model('user.userType')).element(by.css('option:first-child')).getText()).toBe('Worker');
	
		
	});
	
});  
