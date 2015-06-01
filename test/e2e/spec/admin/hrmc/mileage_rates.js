
describe('"Admin / HRMC": Check Mileage Rates', function(){
		
	it('Getting Mileage Rates url', function () {
		browser.get('/admin/hmrc/mileage');
		browser.wait(function () {
			return browser.getCurrentUrl().then(function (url) {
				return (url.indexOf('mileage') !== -1);
			});
		});
	});
	
	it('Checking if Mileage Rates data saved', function (){
		
		var n = null;
		
		
		element.all(by.css('#approvedMileageRates tbody tr')).count().then(function(count){
			n = count;
			expect(n).toBeGreaterThan(0);
			n && testRows(0);
		});
		
		function testRows(index)
		{
			var tmpValue = (Math.random()*0.8+0.1).toFixed(2).replace(/0+$/,'');
			
			var row = element(by.css('#approvedMileageRates tbody tr:nth-child('+(index+1)+')'));
			row.all(by.css('td')).then(function(cols){
			
				cols[2].click();
			
				row.element(by.css("[ng-click=\"showEditFn("+index+")\"]")).click();
				
				row.all(by.model('tempValue')).get(0).clear().sendKeys(tmpValue);
				cols[2].click();
				
				element(by.css('[ng-click="save('+index+')"]')).click();
				
				browser.wait(function(){
					var next = index+1;
					next < n ? testRows(next) : browser.refresh();
					return true;
				});
			
			});
			
			row.all(by.css('td')).then(function(cols){
				expect(cols[2].getText()).toContain(tmpValue);
			});
			
		}
	});
	
});
