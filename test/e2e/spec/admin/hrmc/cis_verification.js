
describe('"Admin / HRMC": Check CIS Verification', function(){

	var inputs = {};

	it('Getting CIS Verification url', function () {
		browser.get('/admin/hmrc/cis');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('hmrc/cis') !== -1);
			});
		});
	});

	it('Open Edit CIS dialog', function() {
		element(by.css('[ng-click="editCis()"]')).click();

		expect(element(by.css('.modal-content')).isDisplayed()).toBeTruthy();
	});

	it('Edit Details', function(){
		//! 'clicking on "Clear Data()"'
		element(by.css('[ng-click="delete()"]')).click();
		helper.alertAccept();
		
		expect(element(by.model('cis.firstName')).getAttribute('value')).toBe('');

		//! 'filling entries'
		element(by.model('cis.userId')).sendKeys(helper.getDefaultNumber());

		element(by.model('cis.password')).sendKeys(helper.getDefaultNumber());

		element(by.model('cis.firstName')).sendKeys('FirstName');

		element(by.model('cis.lastName')).sendKeys('LastName');

		element(by.model('cis.address1')).sendKeys('Address1');

		element(by.model('cis.town')).sendKeys('London');

		element(by.model('cis.country')).sendKeys('Great Britain');

		element(by.model('cis.postCode')).sendKeys('E20 2BB');

		element(by.model('cis.telephone')).sendKeys('02023'+helper.getDefaultNumber());

		element(by.model('cis.fax')).sendKeys('07023'+helper.getDefaultNumber());

		element(by.model('cis.emailAddress')).sendKeys('originemtest2@yandex.com');

		element.all(by.css('[ng-model^="cis."]')).each(function(field){
			var value = null;

			field.getAttribute('type').then(function(type){
				if(type === 'checkbox'){
					field.isSelected().then(function(b){
						value = !!b;
					});
				}
				else {
					field.getAttribute('value').then(function(v){
						value = v;
					});
				}
			});

			field.getAttribute('ng-model').then(function(model){
				inputs[model.replace(/^cis\./, '')] = (value == null ? '' : value).toString();
			});
		});

		element(by.css('[ng-click="save()"]')).click();
		helper.alertAccept();

	});

	it('Checking if data is saved', function(){
		browser.refresh();

		element(by.css('[ng-click="editCis()"]')).click();

		expect(element(by.css('.modal-content')).isDisplayed()).toBeTruthy();

		element.all(by.css('[ng-model^="cis."]')).each(function(field){
			var value = null;

			field.getAttribute('type').then(function(type){
				if(type === 'checkbox'){
					field.isSelected().then(function(b){
						value = !!b;
					});
				}
				else {
					field.getAttribute('value').then(function(v){
						value = v || '';
					});
				}
			});

			field.getAttribute('ng-model').then(function(model){
				//! 'input:', inputs[model.replace(/^cis\./, '')]
				//! 'checking:', model.replace(/^cis\./, ''), value
				expect((value == null ? '' : value).toString()).toBe(inputs[model.replace(/^cis\./, '')]);
			});
		});

		element(by.css('[ng-click="save()"]')).click();
		helper.alertAccept();

	});

});

