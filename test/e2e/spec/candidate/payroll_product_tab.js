var links = $$('.table-view-main-content .tabs-wrapper .nav-tabs a[href^="/candidates/"]');

describe('Navigating to Payroll-Product tab', function () {
/*
	var innerTabs = $$('.tabs-payroll .nav-tabs li');
	var innerLinks = $$('.tabs-payroll .nav-tabs li a');
	var tabContents = $$('.tabs-payroll .tab-content');
*/
	it('Checking Product subtab', function () {
		links.get(2).click();
		$$('.tab-content .nav-tabs li[ng-class="{active: isTabActive(\'product\')}"] a[ng-click="setTabActive(\'product\')"]').click();

		var number = helper.getDefaultNumber();

		var agency = element(by.model('product.agency'));
		var rule = element(by.model('product.holidayPayRule'));
		var contract = element(by.model('product.derogationContract'));
		var spread = element(by.model('product.derogationSpread'));

		var used = element(by.model('product.serviceUsed'));
		var terms = element(by.model('product.paymentTerms'));
		var method = element(by.model('product.paymentMethod'));

		var ref = element(by.model('product.agencyRef'));
		var desc = element(by.model('product.jobDescription'));

		var addNew=function(agencyIndex){
			$('[ng-click="openAddPayrollProductModal()"]').click();

			helper.selectSelector(agency, agencyIndex);
			helper.selectSelector(rule, 1);
			helper.selectSelector(contract, 1);
			spread.clear().sendKeys(number.substr(-3, 3));
			helper.selectSelector(used, 1);
			helper.selectSelector(terms, 1);
			helper.selectSelector(method, 1);
			desc.clear().sendKeys('desc' + number.substr(-3, 3));

			$('[ng-click="saveProduct()"]').click();
		};

		addNew(0);


		var rows = by.repeater('row in options.data');
		var count = 0;
		var minNumber=3;

		element.all(rows).count().then(function (i) {


			element(rows.row(i - 1)).element(by.css('[ng-click="getExternalScope().editProduct(row)"]')).click(); //edit
			it("Checking model 'used'...", function(){
				expect(used.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(0).getText());
			});
			it("Checking model 'agency'...", function(){
				expect(agency.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(1).getText());
			});
			it("Checking model 'rule'...", function(){
				expect(rule.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(3).getText());
			});
			it("Checking model 'contract'...", function(){
				expect(contract.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(4).getText());
			});
			it("Checking model 'spread'...", function(){
				expect(spread.getAttribute('value')).toBe(number.substr(-3, 3));
			});
			it("Checking model 'desc'...", function(){
				expect(desc.getAttribute('value')).toBe('desc' + number.substr(-3, 3));
			});
			it("Checking model 'terms'...", function(){
				expect(terms.getText()).toBe('On full receipt');
			});
			it("Checking model 'method'...", function(){
				expect(method.getText()).toBe('BACS');
			});

			$('[ng-click="cancelEdit()"]').click();
			element(rows.row(i - 1)).element(by.css('[ng-click="getExternalScope().deleteProduct(row)"]')).click(); //delete


			element.all(rows).count().then(function(count){
				expect(count).toBe(i - 1);
				if(count<minNumber)
					for(var k=0;k<minNumber-count;k++){
						addNew(k);
					}

				expect(element.all(rows).count()).toBeGreaterThan(2);
			});


		});

	});



});
