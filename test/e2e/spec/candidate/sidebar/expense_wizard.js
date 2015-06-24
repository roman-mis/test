describe('checking expense wizard', function () {

/*
  it('remove this', function () {
    browser.get('/candidates/54d8dfe9df72120310d2ba0a/payslips');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('candidates') !== -1);
      });
    });
  });
*/

  it('selecting wizard option', function () {

      $('[ng-click="openAddExpensesWin()"]').click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();

  });

  var okBtn = element(by.css('[ng-click="ok()"]'))

  it('selecting agency and default date', function () {
    element(by.css('[ng-click="gotoNext()"]')).click();

    helper.selectSelector(element(by.model('expenseData.agency')), 0);
    element(by.css('[ng-click="gotoNext()"]')).click();
    okBtn.click();
  });

  var days = element(by.model('addData.date'));

  it('adding date', function() {
    var startH = element(by.model('addData.startHours'));
    var startM = element.all(by.model('addData.startMins'));
    var endH = element.all(by.model('addData.endHours'));
    var endM = element.all(by.model('addData.endMins'));
    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(startH, 10);
    helper.selectSimpleSelect(startM, 2);
    helper.selectSimpleSelect(endH, 17);
    helper.selectSimpleSelect(endM, 3);
    
    element(by.css('[ng-click="add()"]')).click();
    
    element.all(by.repeater('item in expenseData.times')).each(function(row){
		row.all(by.tagName('td')).then(function (cols) {

			expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
			cols[1].getText().then(function (str) {
				expect(str.split(':')[0] + ' ').toContain(startH.all(by.tagName('option')).get(10).getText());
				expect(str.split(':')[1] + ' ').toContain(startM.all(by.tagName('option')).get(2).getText());
			});
			cols[2].getText().then(function (str) {
				expect(str.split(':')[0] + ' ').toContain(endH.all(by.tagName('option')).get(17).getText());
				expect(str.split(':')[1] + ' ').toContain(endM.all(by.tagName('option')).get(3).getText());
			});
			okBtn.click(); 
		});
	});           
    
  });
  
  it('adding location', function(){
	element(by.model('addData.code')).sendKeys('E20 2BB');
    helper.selectSimpleSelect(days, 2);
    element(by.css('[ng-click="add()"]')).click();
    
    element.all(by.repeater('item in expenseData.postCodes')).each(function (row) {
      row.all(by.tagName('td')).then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
        expect(cols[1].getText()).toContain('E20 2BB');
        okBtn.click();
      });
    });        
  });
  
  it('transport dialog', function () {

    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(element(by.model('addData.type')), 1);
    element.all(by.model('addData.mileage')).get(0).sendKeys('100');
    element(by.css('[ng-click="add()"]')).click();
    
    element.all(by.repeater('item in expenseData.transports')).each(function (row) {
      row.all(by.tagName('td')).then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
        expect(cols[1].getText()).toContain(element(by.model('addData.type')).all(by.tagName('option')).get(1).getText());
        okBtn.click();
      });
    });    
  });
  
  it('vehicle info dialog', function () { //arbitrariry field
    element(by.model('vehicle.fuelType')).isPresent().then(function (bool) {
      if (bool) {
        helper.selectSimpleSelect(element(by.model('vehicle.fuelType')), 1);
        element(by.model('vehicle.make')).sendKeys('Merzedes ml550');
        element(by.model('vehicle.registration')).sendKeys('12345678');
        helper.selectSimpleSelect(element(by.model('vehicle.engineSize')), 1);
        element(by.css('[ng-click="saveVehicleForm()"]')).click();
      } else {
        console.log('---vehicle info dialog has not be invoked');
      }
    });

  });

  it('Subsistence dialog', function () {

    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(element(by.model('addData.type')), 1);
    element(by.css('[ng-click="add()"]')).click();
    
    element.all(by.repeater('item in expenseData.subsistences')).each(function (row) {
      row.all(by.tagName('td')).then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
   //     expect(cols[1].getText()).toContain(element(by.model('addData.type')).all(by.tagName('option')).get(1).getText());
        okBtn.click();
      });
    });
    
  });
  
  it('Document other expenses', function () {

    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(element(by.model('addData.type')), 1);
    element(by.model('addData.cost')).sendKeys('100');
    element(by.css('[ng-click="add()"]')).click();
    
    element.all(by.repeater('item in expenseData.others')).each(function (row) {
      row.all(by.tagName('td')).then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
     //   expect(cols[1].getText()).toContain(element(by.model('addData.type')).all(by.tagName('option')).get(1).getText());
        expect(cols[2].getText()).toContain('100');
        okBtn.click();
      });
    });
    
    
  });
  
  it('Receipts dialog', function () {
    okBtn.click();
  });

  it('Review & Confirm dialog', function () {
    element.all(by.repeater('item in summaries')).count().then(function (count) {
      expect(count).toBeGreaterThan(0);
      element(by.model('isAgreedOnTerms')).click();
      okBtn.click();
    });
  });

  it('thank you screen', function () {
	//expect(element(by.model('expenseData.claimReference')).getAttribute('value')).toBeTruthy();
	expect(element(by.binding('expenseData.claimReference')).getText()).toBeTruthy();
    element(by.css('[ng-click="cancel()"]')).click();
    helper.alertAccept();
    browser.sleep(2000);
    expect($('.modal-content').isPresent()).toBeFalsy();
  });
});




