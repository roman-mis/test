
var templateHelper = require('./template_helper.js');

describe('"Admin / Templates": cloning templates', function(){
	it('Getting templates url', function () {
		browser.get('/admin/templates');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('templates') !== -1);
			});
		});
	});
	
	it('cloning template', function(){
		
		element.all(by.repeater('raw in options.data')).then(function(rows){
			expect(rows.length).toBeGreaterThan(0);
			if(rows.length){				
				rows[rows.length-1].element(by.css('[ng-click^="options.clone"]')).click();
				rows[rows.length-1].element(by.css('[ng-click^="options.loadAdminTemplate"]')).click();
			}
		});
		
		element(by.css('[ng-click="paste()"]')).click();
		
		templateHelper.fillInputFields({
			name: 'clone template',
			nohead: true
		});
	});
});

describe('"Admin / Templates": remove templates', function(){
	it('Getting templates url', function () {
		browser.get('/admin/templates');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('templates') !== -1);
			});
		});
	});
	
	it('remove template', function processRemoval(){
		var l = null;
		element.all(by.repeater('raw in options.data')).then(function(rows){
			l = rows.length;
			if(l){				
				rows[l-1].element(by.css('[ng-click^="options.deleteAdminTemplate"]')).click();
				browser.driver.switchTo().alert().accept();
			}
		});
		element.all(by.repeater('raw in options.data')).count().then(function(n){
			expect(n).toBeLessThan(l);
			if(n > 9)
				processRemoval();
		});
	});	
	
});

describe('"Admin / Templates": checking search engine', function(){
	it('Getting templates url', function () {
		browser.get('/admin/templates');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('templates') !== -1);
			});
		});
	});
	
	it('checking search engine', function(){
		element(by.model('filterName')).sendKeys('Call Log');
		
		element.all(by.repeater('raw in options.data')).each(function(row){
			row.all(by.css('td')).get(1).getText().then(function(t){
				expect(t.toLowerCase()).toContain('call log');
			});
		});
	});
	
});
