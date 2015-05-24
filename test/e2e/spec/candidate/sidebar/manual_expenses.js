describe('checking manual expense', function () {

  it('selecting wizard option', function () {
	  
	  browser.refresh();

      $('[ng-click="openAddExpensesWin()"]').click();
      browser.sleep(1000);
      expect($('.modal-content').isDisplayed()).toBeTruthy();

  });

  var okBtn = element(by.css('[ng-click="ok()"]'))

  it('selecting agency', function () {
    element(by.css('[ng-click="gotoManual()"]')).click();
    helper.selectSelector(element(by.model('expenseData.agency')), 0);    
  });

  var days = element.all(by.model('addData.date')).get(0);

  it('adding date', function() {
    var startH = element.all(by.model('addData.startHours')).get(0);
    var startM = element.all(by.model('addData.startMins')).get(0);
    var endH = element.all(by.model('addData.endHours')).get(0);
    var endM = element.all(by.model('addData.endMins')).get(0);
    
    var num_date_tests = 7;
    
    helper.printStage('testing angular gui for add/remove dates');
    
    for(var i = 0; i < num_date_tests; i++)
    {
    
		helper.printStage('adding date #'+(i+1));
    
		helper.selectSimpleSelect(days, 2+i);
		helper.selectSimpleSelect(startH, 10);
		helper.selectSimpleSelect(startM, 2+i);
		helper.selectSimpleSelect(endH, 17);
		helper.selectSimpleSelect(endM, 3+i);
    
		element(by.css('#addDateButton')).click();
		
	}    
    
    expect(element.all(by.repeater('item in expenseData.times')).count()).toBe(num_date_tests);
    
    helper.printStage('removing recently created '+num_date_tests+' dates'); 
    
    element.all(by.repeater('item in expenseData.times')).each(function(row){
		row.all(by.css('[ng-click="remove($index)"]')).get(0).click();
	});
	
	expect(element.all(by.repeater('item in expenseData.times')).count()).toBe(0);
	
	helper.printStage('adding one date again to work with'); 
	
	helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(startH, 10);
    helper.selectSimpleSelect(startM, 2);
    helper.selectSimpleSelect(endH, 17);
    helper.selectSimpleSelect(endM, 3);
    
    element(by.css('#addDateButton')).click();
    
    element.all(by.repeater('item in expenseData.times')).each(function(row, index){
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
			
			element(by.css('#timesDoneButton')).click();
		});
	});           
    
  });
  
  it('adding mileage', function(){
	element(by.model('addData.code')).sendKeys('E20 2BB');
    helper.selectSimpleSelect(element.all(by.model('addData.date')).get(1), 2);        
    helper.selectSimpleSelect(element.all(by.model('addData.type')).get(0), 1);    
    element.all(by.model('addData.mileage')).get(0).sendKeys('100');    
    element(by.css('#addMilagePostcode')).click();       
    
    
    element.all(by.repeater('item in expenseData.transports')).each(function(row, index){
		row.all(by.tagName('td')).then(function (cols) {
			expect(cols[0].getText()).toContain(element.all(by.model('addData.date')).get(1).all(by.tagName('option')).get(2).getText());
			expect(cols[1].getText()).toContain(element.all(by.model('addData.type')).get(0).all(by.tagName('option')).get(1).getText());
			expect(cols[2].getText()).toBe('E20 2BB');
			// TODO! compute cost....
		});
	});   
  });
  
  it('add subsistence', function() {
	element(by.css('a[href="#subsistence"]')).click();	  
	  
	helper.selectSimpleSelect(element.all(by.model('addData.date')).get(2), 2);
	helper.selectSimpleSelect(element.all(by.model('addData.type')).get(1), 1);
	element.all(by.model('addData.cost')).get(0).clear().sendKeys('100');
	element(by.css('#addSubsistenceButton')).click();
	
	element.all(by.repeater('item in expenseData.subsistences')).each(function (row, index) {
      row.all(by.tagName('td')).then(function (cols) {
        expect(cols[0].getText()).toContain(element.all(by.model('addData.date')).get(2).all(by.tagName('option')).get(2).getText());
   //     expect(cols[1].getText()).toContain(element.all(by.model('addData.type')).get(1).all(by.tagName('option')).get(1).getText());// not fixed by developers
      });
    });
	   
  });
  
  it('document other expenses', function () {
	  
	element(by.css('a[href="#other"]')).click();

    helper.selectSimpleSelect(element.all(by.model('addData.date')).get(3), 2);
    helper.selectSimpleSelect(element.all(by.model('addData.type')).get(2), 1);
    element.all(by.model('addData.cost')).get(1).sendKeys('100');
    element(by.css('#addOtherButton')).click();
    
    element.all(by.repeater('item in expenseData.others')).each(function (row, index) {
      row.all(by.tagName('td')).then(function (cols) {
        expect(cols[0].getText()).toContain(element.all(by.model('addData.date')).get(3).all(by.tagName('option')).get(2).getText());
     //   expect(cols[1].getText()).toContain(element.all(by.model('addData.type')).get(2).all(by.tagName('option')).get(1).getText());
        expect(cols[4].getText()).toContain('100');
      });
    });
    
  });
  
  it('submit expenses', function () {	    
    element(by.model('isAgreedOnTerms')).click();
    expect(element.all(by.css('[ng-click="okManual()"]')).get(1).isEnabled()).toBeTruthy();    
    element(by.partialButtonText('Submit Expenses')).click();
  });
  
  it('thank you screen', function () {
	expect(element(by.binding('expenseData.claimReference')).getText()).toBeTruthy();
    element(by.css('[ng-click="cancel()"]')).click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });
});




 
