describe('changing vehicle information', function () {
	it('should open site menu', function(){
		element(by.css('span.sitemenu')).click();
	});
	it('should open profile menu', function(){
		element(by.css('[ng-click="myProfile()"]')).click();
	});
	it('should open Vehicle Information dialog', function(){
		element(by.css('[ng-click="vehicle()"]')).click();
		
		$$('.modal-content').get(1).all(by.css('[ng-click="cancel()"]')).first().click();
		helper.alertAccept();
	});
	it('should change vehicle information', function(){
		[0,1,2].forEach(function(number){
			element(by.css('[ng-click="vehicle()"]')).click();
			
			helper.selectSimpleDynamicSelect(element(by.model('vehicle.fuelType')), number);
			helper.selectSimpleDynamicSelect(element(by.model('vehicle.engineSize')), number);		
		
			var fuelType = null;
			var engineSize = null;
		
			element(by.model('vehicle.fuelType')).getAttribute('value').then(function(val){
				fuelType = val;
			});
		
			element(by.model('vehicle.engineSize')).getAttribute('value').then(function(val){
				engineSize = val;
			});
			
			element(by.model('vehicle.make')).clear().sendKeys('Merzedes demo123');
			element(by.model('vehicle.registration')).clear().sendKeys('123123123');
		
		
			$$('.modal-content').get(1).all(by.css('[ng-click="save()"]')).first().click();
			helper.alertAccept();
		
			element(by.css('[ng-click="vehicle()"]')).click();
		
			browser.wait(function(){
				expect(element(by.model('vehicle.fuelType')).getAttribute('value')).toBe(fuelType);
				expect(element(by.model('vehicle.engineSize')).getAttribute('value')).toBe(engineSize);
				return true;
			});
		
			$$('.modal-content').get(1).element(by.css('[ng-click="cancel()"]')).click();
			helper.alertAccept();
		});
		
		[
			{
				no:Math.floor(Math.random()*100000000)+'',
				model: Math.floor(Math.random()*1000)+''
			},
			{
				no:Math.floor(Math.random()*100000000)+'',
				model: Math.floor(Math.random()*1000)+''
			},
			{
				no:Math.floor(Math.random()*100000000)+'',
				model: Math.floor(Math.random()*1000)+''
			}
		].forEach(function(test){
			var isCompanyVehicle = null;
			
			element(by.css('[ng-click="vehicle()"]')).click();
			
			element(by.model('vehicle.make')).clear().sendKeys('Merzedes ml'+test.model);
			element(by.model('vehicle.registration')).clear().sendKeys(test.no);
			element(by.model('vehicle.companyCar')).click();
			element(by.model('vehicle.companyCar')).isSelected().then(function(b){
				isCompanyVehicle = b;
			});
						
					
			$$('.modal-content').get(1).element(by.css('[ng-click="save()"]')).click();
			helper.alertAccept();
		
			element(by.css('[ng-click="vehicle()"]')).click();
		
			expect(element(by.model('vehicle.make')).getAttribute('value')).toBe('Merzedes ml'+test.model);
			expect(element(by.model('vehicle.registration')).getAttribute('value')).toBe(test.no);
			element(by.model('vehicle.companyCar')).isSelected().then(function(b){
				expect(b).toBe(isCompanyVehicle);
			});
		
			$$('.modal-content').get(1).all(by.css('[ng-click="cancel()"]')).first().click();
			helper.alertAccept();
		});
		
		element(by.css('[ng-click="cancel()"]')).click();
		helper.alertAccept();
	});
}); 
