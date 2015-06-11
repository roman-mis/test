var picturePath = require('path').normalize(__dirname + '../../../../sample.png');

describe('Checking Timesheet', function(){

	it('open timesheet dialog', function(){
		//! 'clicking on open dialog'
		element(by.css('[ng-click="openAddTimesheetWin()"]')).click();
		//! 'checking if dialog is opened'
		expect(element(by.css('.modal-window .modal-body')).isDisplayed()).toBeTruthy();
	});

	it('adding timesheet', function(){
		//! 'selecting agency'
		helper.selectSimpleSelect(element(by.model('saveAgency')), 0);
		
		//! 'accepting date'
		element(by.css('#datepicker input')).click();		
		element(by.css('.add-tsh-datepicker [ng-click^="okay()"]')).click();
		
		//! 'typing unit'
		element(by.model('elements.unit')).clear().sendKeys('12');
		//! 'typing payrate'
		element(by.model('elements.payRate')).clear().sendKeys('8');
		//! 'typing description'
		element(by.model('userDescription')).clear().sendKeys('Timesheet description');
		
		var rate, description, unit, payRate;

		element(by.model('saveRate')).getAttribute('value').then(function(index){
			element(by.model('saveRate')).all(by.tagName('option')).get(index|0).getText().then(function(value){
				rate = value;
			});
		});

		element(by.model('userDescription')).getAttribute('value').then(function(value){
			description = value;
		});

		element(by.model('elements.unit')).getAttribute('value').then(function(value){
			unit = value;
		});

		element(by.model('elements.payRate')).getAttribute('value').then(function(value){
			payRate = value;
		});

		//! 'inserting'
		element(by.css('.modal-window .modal-body [ng-click="populateTable()"]')).click();

		//! 'checking input values'
		element.all(by.repeater('element in finalElements')).then(function(rows){
			var row = rows[0];
			//! ' checking rate'
			expect(row.all(by.css('td')).get(0).getText()).toContain(rate);
			//! ' checking description'
			expect(row.all(by.css('td')).get(1).getText()).toContain(description);
			//! ' checking unit'
			expect(row.all(by.css('td')).get(2).getText()).toContain(unit);
			//! ' checking payRate'
			expect(row.all(by.css('td')).get(3).getText()).toContain(payRate);
		});

		//! 'uploading file'
		browser.executeScript("$('#upload_file').css('display', 'block');");
		element(by.css('#upload_file')).sendKeys(picturePath);
		browser.executeScript("$('#upload_file').css('display', 'none');");
		element(by.css('[ng-click="uploadFile()"]')).click();
		//! 'adding timesheet'
		element(by.buttonText('Add Timesheet')).click();
	});

});

