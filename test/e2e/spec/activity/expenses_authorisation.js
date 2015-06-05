var picturePath = require('path').normalize(__dirname + '../../../sample.png');

describe('Check "Activity / Expenses Authorisation"', function() {


	var expenseObject = element.all(by.css('[ng-repeat-start="expense in expensesArray"]')).get(0);
	var expenseData = expenseObject.all(by.xpath('following-sibling::tr')).get(0);
	var collapseListButton = expenseObject.element(by.css('[ng-click^="test1["]'));
	var cancelBtn = element(by.css('[ng-click="cancel()"]'));
	var majorDropDownMenuBtn = element(by.css('table.expenses-auth>thead [data-toggle="dropdown"]'));
	var majorDropDownMenu = majorDropDownMenuBtn.all(by.xpath('following-sibling::ul')).get(0);

	it('Getting Expenses Authorisation url', function () {
		browser.get('/activity/expensesAuthorization');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('expensesAuthorization') !== -1);
			});
		});
	});
	
	it('Collapse items', collapseItems);
	
	it('"Total" value check', function(){
		var sum = 0;
		expenseData.all(by.repeater('item in expense.expenses')).each(function(row){
			//! 'reading row'
			row.element(by.css('td:nth-child(7)')).getText().then(function(totalText){
				var m = totalText.match(/\d+(\.\d\d)?/);
				if(m){
					sum += m[0]*1;
				}
			});
		});
		
		expenseObject.element(by.css('td:nth-child(7)')).getText().then(function(value){
			var m = value.match(/\d+(\.\d\d)?/);
			expect(m).toBeTruthy();
			m && expect(sum.toFixed(2)).toBe(m[0]);
		});		
	});
	
	it('"Receipt preview" check', function(){
		expenseData.all(by.css('[ng-click^="viewReceipt("]')).get(0).click();
		
		expect(element(by.css('.modal-content')).isPresent()).toBeTruthy();
		
		browser.executeScript('$("#uploadBtn").css("display","block")');
		
		//! 'using picture:', picturePath
		
		element(by.css('#uploadBtn')).sendKeys(picturePath);		
		
		browser.executeScript('$("#uploadBtn").css("display","none")');				
				
		element(by.css('[ng-click="uploadFile()"]')).click();
		
		
		browser.wait(function(){
			return element(by.css('[ng-show="!uploading"]')).isDisplayed().then(function(b){
				return b;
			});
		});
		
		cancelBtn.click();
		
		expect(expenseData.all(by.css('[ng-click^="viewReceipt("]')).get(0).element(by.css('.present')).isPresent()).toBeTruthy();
		
		expenseData.all(by.css('[ng-click^="viewReceipt("]')).get(0).click();
		
		expect(element(by.css('.modal-content')).isPresent()).toBeTruthy();
		
		element.all(by.css('[ng-click="deleteReceipt(item)"]')).each(function(btn){
			btn.click();
		});
		
		cancelBtn.click();
		
		expect(expenseData.all(by.css('[ng-click^="viewReceipt("]')).get(0).element(by.css('.present')).isPresent()).toBeFalsy();
	});
	
	it('"Change Status" check', function(){
				
		expenseObject.element(by.model('expense.majorChecked')).click();
		
		//! 'Approve expense'
		
		majorDropDownMenuBtn.click();
		
		majorDropDownMenu.all(by.tagName('li')).get(0).click();
		
		//! 'check if items are approved'
		
		expenseData.all(by.repeater('item in expense.expenses')).each(function(row){
			//! 'reading row'
			row.element(by.css('td:nth-child(9)')).getText().then(function(text){
				expect(text).toBe('Approved');
			});
		});
				
		//! 'Reject expense'
		
		majorDropDownMenuBtn.click();
		
		majorDropDownMenu.all(by.tagName('li')).get(1).click();
		
		expect(element(by.css('div.message')).isPresent()).toBeTruthy();
		
		//! 'check if items are rejected'
		
		expenseData.all(by.repeater('item in expense.expenses')).each(function(row){
			//! 'reading row'
			row.element(by.css('td:nth-child(9)')).getText().then(function(text){
				expect(text).toBe('Rejected');
			});
		});
				
		
	});
	
	it('edit expenses', function(){
	});
	
	function collapseItems(){
		collapseListButton.click();
		
		expenseData.all(by.css('[ng-click^="test2"]')).each(function(btn){
			btn.click();
		});
	}
  
});
