
var templateHelper = module.exports; // self

module.exports.fillInputFields = function fillInputFields(options){
	
	var templateNameNumber = helper.getDefaultNumber();
	
	options = options || {};
	
	var templateBody = element(by.css('#question'));
	
	options.expect_name && console.log('    checking if data is saved');
	options.expect_name && expect(element(by.model('data.details.name')).getAttribute('value')).toContain(options.expect_name);
	
	options.expect_title && expect(element(by.model('data.details.title')).getAttribute('value')).toContain(options.expect_title);
	
	
	options.expect_subType && expect(element(by.model('data.details.current.subType')).getAttribute('value')).toContain(options.expect_subType);
	
	options.expect_question && expect(templateBody.getText()).toContain(options.expect_question);
		
	!options.nohead && element(by.model('data.details.name')).clear().sendKeys(options.name.toLowerCase() + ' template #' + templateNameNumber);
		
	!options.nohead && element(by.model('data.details.title')).clear().sendKeys(options.name+' Template #' + templateNameNumber);
	// not working //
	//element(by.model('data.details.templateBody')).clear().sendKeys(options.name+' Template #' + templateNameNumber);
	// not working //
	//browser.executeScript("$('#question').html(options.name+' Template Description')");
	
	templateBody.click();
		
	templateBody.clear().sendKeys(options.name+" Template Question");
		
	//! 'clicking on "subType" input'
	element(by.model('data.details.current.subType')).click();
	
	element.all(by.css('.dropdown-menu [role="menuitem"][ng-click]')).count().then(function(n){
		if(n){
			//! 'clicking dropdown menu'	
			element.all(by.css('.dropdown-menu [role="menuitem"][ng-click]')).get(0).click();
		}
		else {
			element(by.model('data.details.current.subType')).clear().sendKeys('test type');
		}
	});
	
	//! 'clicking on merge'
	element(by.model('data.details.mergeFields')).click();
	
	element.all(by.css('.dropdown-menu li[ng-click^="setMergeField"]')).count().then(function(n){
		if(n){
			//! 'clicking dropdown menu'	
			element.all(by.css('.dropdown-menu li[ng-click^="setMergeField"]')).get(0).click();
		}
	});
	
	element(by.model('data.details.name')).getAttribute('value').then(function(value){
		options.expect_name = value;
	});
	
	element(by.model('data.details.title')).getAttribute('value').then(function(value){
		options.expect_title = value;
	});
	
	element(by.model('data.details.current.subType')).getAttribute('value').then(function(value){
		options.expect_subType = value;
	});
	
	templateBody.getText().then(function(value){
		options.expect_question = value;
	});
	
	
	//! 'clicking on "Save"'
	expect(element(by.css('[ng-click="save()"]')).isEnabled()).toBeTruthy();
		
	element(by.css('[ng-click="save()"]')).click();
		
	browser.wait(function () {
		return browser.getCurrentUrl().then(function (url) {
			return (url.indexOf('templates') !== -1);
		});
	});
	
};

module.exports.testTemplate = function(template_name){
	
	var template_name_lc = template_name.toLowerCase();
	
	var test_options = {
		name: template_name
	};
	
	describe('"Admin / Templates": create '+template_name_lc+' template', function() {

		it('Getting templates url', function () {
			browser.get('/admin/templates');
			browser.wait(function () {
				return browser.getCurrentUrl().then(function (url) {
					return (url.indexOf('templates') !== -1);
				});
			});
		});
  
		it('open Create '+template_name+' dialog', function() {
			var addNewButton = element(by.partialButtonText('Add New'));
		
			//! 'clicking on "Add New" button'
			addNewButton.click();
		
			//! 'clicking at first index of button which must be a "Call Log"'
			helper.getByText(addNewButton.element(by.xpath('..')).all(by.css('.dropdown-menu li a[ng-click]')),template_name).click();
	  
			//! 'waiting for url change'
			browser.wait(function () {
				return browser.getCurrentUrl().then(function (url) {
					return (url.indexOf(template_name.replace(' ','_','g').toLowerCase()) !== -1);
				});
			});
		});
		
		it('create '+template_name_lc+' template', function(){
		
			templateHelper.fillInputFields(test_options);
		
		
		});
  
	});

	describe('"Admin / Templates": edit '+template_name_lc+' template', function() {
	
		it('open template dialog for editing', function(){
			element.all(by.repeater('raw in options.data')).then(function(rows){
				expect(rows.length).toBeGreaterThan(0);
			
				rows[rows.length-1].element(by.css('[ng-click^="options.loadAdminTemplate"]')).click();		
			
			});
		
			//! 'waiting for url change'
			browser.wait(function () {
				return browser.getCurrentUrl().then(function (url) {
					return (url.indexOf('edit') !== -1);
				});
			});
		});
	
		it('edit template', function(){
		
			templateHelper.fillInputFields(test_options);
		
		});
	
	});
};

 
