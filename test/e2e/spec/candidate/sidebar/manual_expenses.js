describe('checking manual expense', function () {

  it('selecting wizard option', function () {

      $('[ng-click="openAddExpensesWin()"]').click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();

  });

  var okBtn = element(by.css('[ng-click="ok()"]'))

  it('selecting agency and default date', function () {
    element(by.css('[ng-click="gotoManual()"]')).click();

    helper.selectSelector(element(by.model('expenseData.agency')), 0);
  });

  var days = element.all(by.model('addData.date')).get(0);

  it('adding date', function() {
    var startH = element.all(by.model('addData.startHours')).get(0);
    var startM = element.all(by.model('addData.startMins')).get(0);
    var endH = element.all(by.model('addData.endHours')).get(0);
    var endM = element.all(by.model('addData.endMins')).get(0);
    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(startH, 10);
    helper.selectSimpleSelect(startM, 2);
    helper.selectSimpleSelect(endH, 17);
    helper.selectSimpleSelect(endM, 3);
    
    element.all(by.css('[ng-click="add()"]')).get(0).click();
    
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
			
			element(by.css('#timesDoneButton')).click();
		});
	});           
    
  });
  
  it('adding mileage', function(){
	element(by.model('addData.code')).sendKeys('E20 2BB');	
    helper.selectSimpleSelect(element.all(by.model('addData.date')).get(1), 2);        
    helper.selectSimpleSelect(element.all(by.model('addData.type')).get(0), 1);    
    element.all(by.model('addData.mileage')).get(0).sendKeys('100');    
    element(by.css('[ng-click="addManual()"]')).click();    
    element(by.css('a[href="#subsistence"]')).click();  
  });
  
  it('add subsistence', function() {
	helper.selectSimpleSelect(element.all(by.model('addData.date')).get(2), 2);
	helper.selectSimpleSelect(element.all(by.model('addData.type')).get(1), 1);
	element.all(by.model('addData.cost')).get(0).sendKeys('100');
	element.all(by.css('[ng-click="add()"]')).get(1).click();
	element(by.css('a[href="#other"]')).click();   
  });
  
  it('document other expenses', function () {

    helper.selectSimpleSelect(element.all(by.model('addData.date')).get(3), 2);
    helper.selectSimpleSelect(element.all(by.model('addData.type')).get(2), 1);
    element.all(by.model('addData.cost')).get(1).sendKeys('100');
    element.all(by.css('[ng-click="add()"]')).get(2).click();
    
  });
  
  it('submit expenses', function () {	    
    element(by.model('isAgreedOnTerms')).click();
    expect(element.all(by.css('[ng-click="okManual()"]')).get(1).isEnabled()).toBeTruthy();
    element.all(by.css('[ng-click="okManual()"]')).get(1).click();    
  });
  
  it('thank you screen', function () {
	expect(element(by.binding('expenseData.claimReference')).getText()).toBeTruthy();
    element(by.css('[ng-click="cancel()"]')).click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });
});




 
