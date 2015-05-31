
var templateHelper = module.exports; // self

module.exports.fillInputFields = function fillInputFields(options){
	
	var templateNameNumber = helper.getDefaultNumber();
	
	options = options || {};
	
	var templateBody = element(by.css('#question'));
	
		
	!options.nohead && element(by.model('data.details.name')).clear().sendKeys(options.name.toLowerCase() + ' template #' + templateNameNumber);
		
	!options.nohead && element(by.model('data.details.title')).clear().sendKeys(options.name+' Template #' + templateNameNumber);
	// not working //
	//element(by.model('data.details.templateBody')).clear().sendKeys(options.name+' Template #' + templateNameNumber);
	// not working //
	//browser.executeScript("$('#question').html(options.name+' Template Description')");
	
	templateBody.click();
		
	templateBody.clear().sendKeys(options.name+" Template Description");
		
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
	
	
	//! 'clicking on "Save"'
	expect(element(by.css('[ng-click="save()"]')).isEnabled()).toBeTruthy();
		
	element(by.css('[ng-click="save()"]')).click();
		
	browser.wait(function () {
		return browser.getCurrentUrl().then(function (url) {
			return (url.indexOf('templates') !== -1);
		});
	});
	
	element.all(by.repeater('col in options.columns')).then(function(cols){
		var column_names = {};
		
		cols.forEach(function(col, index){
			col.getText().then(function(name){
				column_names['_'+name.trim().replace(' ','_','g')] = index;
			});
		});
		
		
	});
	
};

module.exports.testTemplate = function(template_name){
	
	var template_name_lc = template_name.toLowerCase();
	
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
		
			templateHelper.fillInputFields({
				name: template_name
			});
		
		
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
		
			templateHelper.fillInputFields({
				name: template_name
			});
		
		});
	
	});
};

 
