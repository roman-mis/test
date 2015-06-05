 
describe('Check "Admin / Statutory rates"', function() {
		
	var items = element.all(by.css('table>tbody>tr'));
	//var edit_item = element.all(by.css('[ng-click^="openModal("]')).first();	
	var cancelBtn = element(by.css('[ng-click="cancel()"]'));
	var saveBtn = element(by.css('[ng-click="ok()"]'));
	var rows = element.all(by.css('[ng-repeat="elem in parentScope.statutoryRates[parentScope.type] | validDate "]'));
	var row = rows.last();
	
	
	it('Getting Statutory rates url', function () {
		browser.get('/admin/statutory_rates');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('/admin/statutory_rates') !== -1);
			});
		});
	});
	
	[
	"NMW",
	"Employer's NI threshold",
	"Employer's NI rate",
	"Employee's NI threshold - lower",
	"Employee's NI main rate",
	"Employee's NI threshold - higher",
	"Employee's NI high earner rate",
	"Income Tax Higher Rate Threshold", // contains some invisible data in table
	"Income Tax Additional Rate Threshold",
	"Income Tax Basic Rate",
	"Income Tax Higher Rate",
	"Income Tax Additional Rate",
	"VAT",
	"SSP Rate",
	"SMP Rate",
	"SPP Rate",
	//"Work patterns" // not implemented
	].forEach(testItem);
	
	function testItem(itemName, index){
		
		var item = items.get(index);
		
		var edit_item = item.element(by.css('[ng-click^="openModal("]'));	
	
		var dateStart = null,
		dateEnd,
		number,
		dateStartStr,
		dateEndStr,
		rangeId;
		
		var hasComboBox = false;
	
		it('"' + itemName + '" > ' + 'insert rate into table', function() {	
			
			expect(item.all(by.tagName('td')).get(0).getText()).toBe(itemName);
		
			edit_item.click();
		
			//! 'trying to get end date from last row to make sure this test will work'
			rows.each(function(row){
				row.all(by.tagName('td')).get(3).getText().then(function(v){
					//! 'checking date', v
					var vv = v.split('/');
					var date = new Date();
					date.setDate(vv[0]|0);
					date.setMonth(vv[1]-1);
					date.setFullYear(vv[2]|0);
					date = new Date(date.getTime() + 1000*60*60*24*10);
				
					if(dateStart == null || dateStart < date){
						dateStart = date;
					}
				});
			});
		
			browser.wait(function(){
				if(dateStart == null)
					dateStart = new Date(new Date().getTime() + 1000*60*60*24*10);
				dateEnd = new Date(dateStart.getTime() + 1000*60*60*24*10);
		
				number = (Math.random()*20+0.5)|0+1;
		
				dateStartStr = [('0'+dateStart.getDate()).slice(-2),('0'+(dateStart.getMonth()+1)).slice(-2),dateStart.getFullYear()].join('/');
				dateEndStr = [('0'+dateEnd.getDate()).slice(-2),('0'+(dateEnd.getMonth()+1)).slice(-2),dateEnd.getFullYear()].join('/');
			
				element(by.model('parentScope.newElement.amount')).clear().sendKeys(number);
		
				element.all(by.model('ngModel')).get(0).clear().sendKeys(dateStartStr);

				element.all(by.model('ngModel')).get(1).clear().sendKeys(dateEndStr);
			
				return true;
			});		
			element(by.model('selectedRangeId')).isPresent().then(function(b){				
				hasComboBox = b;
				b && helper.selectSimpleDynamicSelect(element(by.model('selectedRangeId')), 0, function(v){
					rangeId = v;
					expect(v).toBe('21 and over');
				});
			});
		
			element(by.css('[ng-click="parentScope.addNew(parentScope.newElement)"]')).click();		
		
			browser.wait(function(){
				expect(row.all(by.tagName('td')).get(1).getText()).toBe(number + '');
				expect(row.all(by.tagName('td')).get(2).getText()).toBe(dateStartStr);
				expect(row.all(by.tagName('td')).get(3).getText()).toBe(dateEndStr);
				hasComboBox && expect(row.all(by.tagName('td')).get(4).getText()).toBe('Age: 21 - 1000');
		
				return true;
			});
		
			saveBtn.click();
		
			browser.refresh();
		
			edit_item.click();
		
			browser.wait(function(){
		
				expect(row.all(by.tagName('td')).get(1).getText()).toBe(number + '');
				expect(row.all(by.tagName('td')).get(2).getText()).toBe(dateStartStr);
				expect(row.all(by.tagName('td')).get(3).getText()).toBe(dateEndStr);
				hasComboBox && expect(row.all(by.tagName('td')).get(4).getText()).toBe('Age: 21 - 1000');
		
				return true;
			});
				
		
		});
	
		it('"' + itemName + '" > ' + 'remove rate from table', function(){
			row.element(by.css('[ng-click="parentScope.deleteOne(elem.validFrom)"]')).click();
		
			cancelBtn.click();
		});
		
	}
	
});
