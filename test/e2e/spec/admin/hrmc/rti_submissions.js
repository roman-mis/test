
describe('"Admin / HRMC": Check RTI Submissions', function(){

	var number = helper.getDefaultNumber();

	it('Getting RTI Submissions url', function () {
		browser.get('/admin/hmrc/rti');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('rti') !== -1);
			});
		});
	});

	it('Open Edit RTI dialog', function() {
		element(by.css('[ng-click="openEditRti()"]')).click();
		browser.sleep(1000);
		expect(element(by.css('.modal-content')).isDisplayed()).toBeTruthy();
	});

	it('Edit Details', function(){
		//! 'clicking on "Clear Data()"'
		element(by.css('[ng-click="delete()"]')).click();
		helper.alertAccept();
		
		expect(element(by.model('rti.firstName')).getAttribute('value')).toBe('');

		//! 'filling entries'
		element(by.model('rti.enableRti')).click();

		element(by.model('rti.userId')).sendKeys('Y'+number);

		element(by.model('rti.password')).sendKeys('P'+number);

		element(by.model('rti.firstName')).sendKeys('FirstName');

		element(by.model('rti.lastName')).sendKeys('LastName');

		element(by.model('rti.address1')).sendKeys('Address1');
		element(by.model('rti.address2')).sendKeys('Address2');

		element(by.model('rti.eligibleSmallEmployerAllowance')).click();

		element(by.model('rti.claimEmploymentAllowance')).click();

		element(by.model('rti.town')).sendKeys('London');

		helper.selectSelector(element(by.model('rti.country')), 0);

		element(by.model('rti.postCode')).sendKeys('E20 2BB');

		element(by.model('rti.telephone')).sendKeys('02023'+number);

		element(by.model('rti.fax')).sendKeys('07023'+number);

		element(by.model('rti.emailAddress')).sendKeys('originemtest2@yandex.com');
	
		element(by.css('[ng-click="save()"]')).click();
		helper.alertAccept();

	});

	it('Checking if data is saved', function(){
		browser.refresh();
		
		var fields = $$('#RTISubmissions td.ng-binding[align="right"]');
		
		expect(fields.get(0).getText()).toBe('Yes');
		expect(fields.get(1).getText()).toBe('Y'+number);
		expect(fields.get(2).getText()).toBe('P'+number);
		expect(fields.get(3).getText()).toBe('FirstName');
		expect(fields.get(4).getText()).toBe('LastName');
		expect(fields.get(5).getText()).toBe('Address1');
		expect(fields.get(6).getText()).toBe('Address2');
		expect(fields.get(7).getText()).toBe('Yes');
		expect(fields.get(8).getText()).toBe('London');
		expect(fields.get(9).getText()).toBe('United Kingdom');
		expect(fields.get(10).getText()).toBe('E20 2BB');
		expect(fields.get(11).getText()).toBe('02023'+number);
		expect(fields.get(12).getText()).toBe('07023'+number);
		expect(fields.get(13).getText()).toBe('originemtest2@yandex.com');
		
	});

});
