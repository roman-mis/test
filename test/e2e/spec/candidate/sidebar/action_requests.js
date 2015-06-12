var picturePath = require('path').normalize(__dirname + '../../../../sample.png');

describe('Checking Action Requests', function(){
	function toggleOnActionRequestMenu()
	{
		var el = element.all(by.css('#left-menu [collapse="isActionRequestCollapsed"]')).first();
		el.getAttribute('class').then(function(classStr){
			var classes = classStr.split(/ +/g);
			if(classes.indexOf('in') == -1){
				//! 'toggle on "Action Request" buttons'
				element(by.css('#left-menu [ng-if="!permissions.rightToolBar.actionRequest.hide"] [ng-click="toggle()"]')).click();
				//! 'wait for "toggle" animation'
				browser.sleep(2000);
				el.getAttribute('class').then(function(classStr){
					var isToggledOn = classStr.split(' ').indexOf('in') != -1;
					//! 'check if toggled:', isToggledOn
					expect(isToggledOn).toBeTruthy();
				});
			}
			else {
				//! '"Action Request" buttons are already visible'
			}
		});
	}

	var btnSave = element(by.css('.modal-footer')).all(by.buttonText('Save')).first();

	it('should display action requests menu', function(){
		browser.refresh();
		toggleOnActionRequestMenu();
	});

	it('should make Student Loan (SL) requests', function(){
		browser.refresh();
		toggleOnActionRequestMenu();
		//! 'Opening dialog'
		element(by.css('[ng-click="openSl()"]')).click();
		expect(element(by.css('.modal-content')).isPresent()).toBeTruthy();

		//! 'Clicking on checkboxes'
		element(by.model('studentLoan.haveLoan')).click();
		element(by.model('studentLoan.payDirectly')).click();

		browser.sleep(1500); // some promise is blocking protractor
		//! 'Saving changes by clicking on button'
		btnSave.click();
		helper.alertAccept();
		browser.sleep(50);
		expect(element(by.css('.alert-success')).isPresent()).toBeTruthy();
		browser.sleep(500);
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();

	});

	it('should make P45 requests', function(){
		browser.refresh();
		toggleOnActionRequestMenu();
		//! 'Opening dialog'
		element(by.css('[ng-click="openP45()"]')).click();
		expect(element(by.css('.modal-content')).isPresent()).toBeTruthy();

		//! 'Typing request date'
		element.all(by.model('dateRequested')).all(by.css('input')).first().clear().sendKeys('01/01/2015');
		//! 'Typing leaving date'
		element.all(by.model('leavingDate')).all(by.css('input')).first().clear().sendKeys('07/01/2015');

		//! 'Temporaly make input[type="file"] displayable'
		browser.executeScript('$("#uploadBtn").css("display","inline-block")');
		//! 'Using picture "'+picturePath+'"'
		element(by.css('#uploadBtn')).sendKeys(picturePath);
		browser.executeScript('$("#uploadBtn").css("display","none")');
		//! 'Clicking on "Upload" button'
		element(by.css('[ng-click="uploadFile()"]')).click();
		browser.wait(function(){
			return element(by.partialButtonText('Cancel upload')).isPresent().then(function(b){
				return !b;
			});
		});

		//! 'Clicking on "Save" button'

		btnSave.click();
		helper.alertAccept();    
		expect(element(by.css('.alert-success')).isPresent()).toBeTruthy();
		browser.sleep(1000);
		expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
	});
});
