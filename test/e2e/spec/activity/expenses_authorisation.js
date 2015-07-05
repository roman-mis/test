var picturePath = require('path').normalize(__dirname + '../../../sample.png');

describe('Check "Activity / Expenses Authorisation"', function() {


	var expenseObject = element.all(by.css('[ng-repeat-start="expense in expensesArray"]')).get(0);
	var expenseData = expenseObject.all(by.xpath('following-sibling::tr')).get(0);
	var collapseListButton = expenseObject.element(by.css('[ng-click^="test1["]'));
	var cancelBtn = element(by.css('[ng-click="cancel()"]'));
	var majorDropDownMenuBtn = element.all(by.css('table.expenses-auth')).first().all(by.css('[data-toggle="dropdown"]')).first();
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
			row.element(by.css('td:nth-child(7)')).getText().then(function(totalTxt){
				
				//! totalTxt
				var m = totalTxt.replace(',','').match(/\d+(\.\d\d)?/);
				if(m){
					sum += m[0]*1;
				}
			});
		});
		
		expenseObject.element(by.css('td:nth-child(7)')).getText().then(function(value){
			var m = value.replace(',','').match(/\d+(\.\d\d)?/);
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
		helper.alertAccept();
		browser.sleep(1000);
		
		expect(expenseData.all(by.css('[ng-click^="viewReceipt("]')).get(0).element(by.css('.present')).isPresent()).toBeTruthy();
		
		expenseData.all(by.css('[ng-click^="viewReceipt("]')).get(0).click();
		
		expect(element(by.css('.modal-content')).isPresent()).toBeTruthy();
		
		element.all(by.css('[ng-click="deleteReceipt(item)"]')).each(function(btn){
			btn.click();
		});
		
		cancelBtn.click();
		helper.alertAccept();
		
		expect(expenseData.all(by.css('[ng-click^="viewReceipt("]')).get(0).element(by.css('.present')).isPresent()).toBeFalsy();
	});
	
	it('"Change Status" check', function(){
		expenseData.all(by.model('item.checked')).get(0).click();
		
		//! 'Approve expense'
		
		majorDropDownMenuBtn.click();
		
		majorDropDownMenu.all(by.tagName('li')).get(0).click();		
		
		//! 'check if items are approved'
		
		expenseData.all(by.repeater('item in expense.expenses')).then(function(rows){
			rows[0].element(by.css('td:nth-child(9)')).getText().then(function(text){
				expect(text).toBe('Approved');
			});
		});		
		
		
		
	});
	
	it('edit expenses', function(){
		$$('a[ng-hide="item.edit"]').get(0).click();
		
		var detailName,
		date,
		amount = '123',
		status;
		
		var selectorDetailName = element(by.model('cloned[$parent.$parent.$parent.$parent.$parent.$parent.$index].expenses[$parent.$parent.$index].expenseDetail.name'));
		
		var selectorDate = element(by.model('cloned[$parent.$parent.$parent.$parent.$parent.$parent.$index].expenses[$parent.$parent.$index].date'));
		
		var numberAmount = element(by.model('cloned[$parent.$parent.$parent.$parent.$parent.$index].expenses[$parent.$index].amount'));
		
		var expenseItemStatus = element(by.model('cloned[$parent.$parent.$parent.$parent.$parent.$index].expenses[$parent.$index].status'));
		
		var saveExpenseItems = element(by.css('[ng-click="item.edit=false; finishEditing($parent.$parent.$parent.$parent.$parent.$index, item._id, true)"]'));
		
		var row = expenseData.all(by.repeater('item in expense.expenses')).get(0);
		
		helper.selectSimpleDynamicSelect(selectorDetailName, 1, function(v){
			detailName = v;
		});
		
		helper.selectSimpleDynamicSelect(selectorDate, 1, function(v){
			date = v;
		});
		
		numberAmount.clear().sendKeys(amount);
		
		helper.selectSimpleDynamicSelect(expenseItemStatus, 0, function(v){
			status = v;
		});
		
		saveExpenseItems.click();		
		
		browser.wait(function(){
			expect(row.element(by.css('td:nth-child(2)')).getText()).toBe(detailName);
			expect(row.element(by.css('td:nth-child(3)')).getText()).toBe(date);
			expect(row.element(by.css('td:nth-child(4)')).getText()).toBe((amount*1).toFixed(2));
			expect(row.element(by.css('td:nth-child(9)')).getText()).toBe(status);
			return true;
		});	
		
	});
	
	it('Review summary & reject', function(){
		
		//! 'Reject expense'
				
		majorDropDownMenuBtn.click();
		
		majorDropDownMenu.all(by.tagName('li')).get(1).click();
		
		expect(element(by.css('div.message')).isPresent()).toBeTruthy();
		
		//! 'check if items are rejected'
		
		expenseData.all(by.repeater('item in expense.expenses')).then(function(rows){
			rows[0].element(by.css('td:nth-child(9)')).getText().then(function(text){
				expect(text).toBe('Rejected');
			});
		});
				
		
		$('[ng-click="reviewSummary()"]').click();
		
		expect($('.modal-content').isPresent()).toBeTruthy();
		
		element.all(by.model('expense.reason')).each(function(reasonType){
			helper.selectSimpleSelect(reasonType, 1);
		});
		
		$('[ng-click="ok()"]').click();
		helper.alertAccept();
		browser.sleep(1000);
		
		expect($('.modal-content').isPresent()).toBeFalsy();
	});
	
	function collapseItems(){
		collapseListButton.click();			
		
		expenseData.all(by.css('[ng-click^="test2"]')).each(function(btn){
			btn.click();
		});
		
	}
  
});
