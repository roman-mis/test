
describe('"Admin / HRMC": Check RTI Submissions', function(){
	
	var inputs = {};
	
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
		
		expect(element(by.css('.modal-content')).isDisplayed()).toBeTruthy();
	});
	
	it('Edit Details', function(){
		//! 'clicking on "Clear Data()"'
		element(by.css('[ng-click="delete()"]')).click();
		
		//! 'filling entries'
		element(by.model('rti.enableRti')).click();
		
		element(by.model('rti.userId')).sendKeys(helper.getDefaultNumber());
		
		element(by.model('rti.password')).sendKeys(helper.getDefaultNumber());
		
		element(by.model('rti.firstName')).sendKeys('FirstName');
		
		element(by.model('rti.lastName')).sendKeys('LastName');
		
		element(by.model('rti.address1')).sendKeys('Address1');
		
		element(by.model('rti.eligibleSmallEmployerAllowance')).click();
		
		element(by.model('rti.claimEmploymentAllowance')).click();
		
		element(by.model('rti.town')).sendKeys('London');
		
		element(by.model('rti.country')).sendKeys('Great Britan');
		
		element(by.model('rti.postCode')).sendKeys('E20 2BB');
		
		element(by.model('rti.telephone')).sendKeys(helper.getDefaultNumber());
		
		element(by.model('rti.fax')).sendKeys(helper.getDefaultNumber());
		
		element(by.model('rti.emailAddress')).sendKeys('boojaka@gmail.com');
		
		element.all(by.css('[ng-model^="rti."]')).each(function(field){
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
				inputs[model.replace(/^rti\./, '')] = (value == null ? '' : value).toString();
			});
		});
		
		element(by.css('[ng-click="save()"]')).click();
		
	});
	
	it('Checking if data is saved', function(){
		browser.refresh();
		
		element(by.css('[ng-click="openEditRti()"]')).click();
		
		expect(element(by.css('.modal-content')).isDisplayed()).toBeTruthy();
		
		element.all(by.css('[ng-model^="rti."]')).each(function(field){
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
				//! 'input:', inputs[model.replace(/^rti\./, '')]
				//! 'checking:', model.replace(/^rti\./, ''), value
				expect((value == null ? '' : value).toString()).toBe(inputs[model.replace(/^rti\./, '')]);
			});
		});
		
		element(by.css('[ng-click="save()"]')).click();
		
	});
	
}); 
