var picturePath = require('path').normalize(__dirname + '../../../../sample.png');

describe('Checking Timesheet', function(){
	
	it('open timesheet dialog', function(){
		//! 'clicking on open dialog'
		element(by.css('[ng-click="openAddTimesheetWin()"]')).click();
		//! 'checking if dialog is opened'
		expect(element(by.css('.modal-window .modal-body')).isDisplayed()).toBeTruthy();
	});
	
	it('adding timesheet', function(){
		//! 'clicking on add date'
		element.all(by.css('[ng-click="clicked = true"]')).get(1).click();
		//! 'selecting week'
		element(by.css('[ng-click="move(-1)"]')).click();
		element.all(by.css('[ng-click="select(dt.date)"]')).get(12).click();	
		
		//! 'accepting date'
		element(by.css('.add-tsh-datepicker [ng-click^="okay()"]')).click();
		//! 'typing unit'
		element(by.model('elements.unit')).clear().sendKeys('12');
		//! 'typing payrate'
		element(by.model('elements.payRate')).clear().sendKeys('8');
		//! 'typing description'
		element(by.model('userDescription')).clear().sendKeys('Timesheet description');
		//! 'inserting'
		element(by.css('.modal-window .modal-body [ng-click="populateTable()"]')).click();
		//! 'uploading file'
		browser.executeScript("$('#upload_file').css('display', 'block');");
		element(by.css('#upload_file')).sendKeys(picturePath);
		browser.executeScript("$('#upload_file').css('display', 'none');");
		element(by.css('[ng-click="uploadFile()"]')).click();
		//! 'adding timesheet'
		element(by.buttonText('Add Timesheet')).click();
	});
	
});
 
