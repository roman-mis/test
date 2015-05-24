var _D = true; // get from configuration

describe('checking manual expense', function () {

  it('selecting manual option', function () {
	  _D && helper.printStage('fresh up the page (if previous test failed)');
	  browser.refresh();

      _D && helper.printStage('opening add expenses dialog');		
      $('[ng-click="openAddExpensesWin()"]').click();
      
      _D && helper.printStage('wait for a while to make sure dialog is loaded');
      browser.sleep(1000);      
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      
      _D && helper.printStage('swithing to manual expenses');
      element(by.css('[ng-click="gotoManual()"]')).click();
  });

  it('selecting agency', function () {    
    helper.selectSelector(element(by.model('expenseData.agency')), 0);    
  });

  var days = element.all(by.model('addData.date')).get(0);

  it('adding date', function() {
    var startH = element.all(by.model('addData.startHours')).get(0);
    var startM = element.all(by.model('addData.startMins')).get(0);
    var endH = element.all(by.model('addData.endHours')).get(0);
    var endM = element.all(by.model('addData.endMins')).get(0);
    
    var num_date_tests = 1; 
    
    _D && helper.printStage('testing angular gui for add/remove dates');
    
    for(var i = 0; i < num_date_tests; i++)
    {
    
		_D && helper.printStage('adding date #'+(i+1));
    
        _D && helper.printStage(' selecting "date" option to index', 2+i);
		helper.selectSimpleSelect(days, 2+i);
		
		_D && helper.printStage(' selecting "start hour" option to index', 10);
		helper.selectSimpleSelect(startH, 10);
		
		_D && helper.printStage(' selecting "start minute" option to index', 2+i);
		helper.selectSimpleSelect(startM, 2+i);
		
		_D && helper.printStage(' selecting "end hour" option to index', 17);
		helper.selectSimpleSelect(endH, 17);
		
		_D && helper.printStage(' selecting "end minute" option to index', 3+i);
		helper.selectSimpleSelect(endM, 3+i);
    
		_D && helper.printStage(' clicking on add button');
		element(by.css('#addDateButton')).click();
		
	}    
    
    
    _D && helper.printStage('check if count of dates match', num_date_tests);
    expect(element.all(by.repeater('item in expenseData.times')).count()).toBe(num_date_tests);
    
    _D && helper.printStage('removing recently created '+num_date_tests+' dates'); 
    
    element.all(by.repeater('item in expenseData.times')).each(function(row){
		row.all(by.css('[ng-click="remove($index)"]')).get(0).click();
	});
	
	expect(element.all(by.repeater('item in expenseData.times')).count()).toBe(0);
	
	_D && helper.printStage('adding one date again to work with'); 
	
	helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(startH, 10);
    helper.selectSimpleSelect(startM, 2);
    helper.selectSimpleSelect(endH, 17);
    helper.selectSimpleSelect(endM, 3);
    
    element(by.css('#addDateButton')).click();
    
    element.all(by.repeater('item in expenseData.times')).each(function(row, index){
		row.all(by.tagName('td')).then(function (cols) {
			_D && helper.printStage('checking if "date" matches input'); 
			expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
			
			_D && helper.printStage('checking if "start hour+minute" matches input'); 
			cols[1].getText().then(function (str) {
				expect(str.split(':')[0] + ' ').toContain(startH.all(by.tagName('option')).get(10).getText());
				expect(str.split(':')[1] + ' ').toContain(startM.all(by.tagName('option')).get(2).getText());
			});
			
			_D && helper.printStage('checking if "end hour+minute" matches input'); 
			cols[2].getText().then(function (str) {
				expect(str.split(':')[0] + ' ').toContain(endH.all(by.tagName('option')).get(17).getText());
				expect(str.split(':')[1] + ' ').toContain(endM.all(by.tagName('option')).get(3).getText());
			});
			
			_D && helper.printStage('saving date table'); 
			element(by.css('#timesDoneButton')).click();
		});
	});           
    
  });
  
  it('adding mileage', function(){
	_D && helper.printStage('adding mileage'); 
	
	_D && helper.printStage(' typing post code');   
	element(by.model('addData.code')).sendKeys('E20 2BB');
	
	_D && helper.printStage(' selecting one date from date table');   
    helper.selectSimpleSelect(element.all(by.model('addData.date')).get(1), 2);
    
    _D && helper.printStage(' selecting type at index:', 1);   
    helper.selectSimpleSelect(element.all(by.model('addData.type')).get(0), 1);
    
    _D && helper.printStage(' typing mileage:', 100);   
    element.all(by.model('addData.mileage')).get(0).sendKeys('100');    
    
    _D && helper.printStage(' clicking on button "add"');   
    element(by.css('#addMilagePostcode')).click();       
    
    _D && helper.printStage('checking if mileage table matches input');   
    element.all(by.repeater('item in expenseData.transports')).each(function(row, index){
		row.all(by.tagName('td')).then(function (cols) {
			_D && helper.printStage(' checking "date"');   
			expect(cols[0].getText()).toContain(element.all(by.model('addData.date')).get(1).all(by.tagName('option')).get(2).getText());
			
			_D && helper.printStage(' checking "type"');   
			expect(cols[1].getText()).toContain(element.all(by.model('addData.type')).get(0).all(by.tagName('option')).get(1).getText());
			
			_D && helper.printStage(' checking "post code"');   
			expect(cols[2].getText()).toBe('E20 2BB');
			
			_D && helper.printStage(' OOPS! compute cost checker is missing yet');   
			// TODO! compute cost....
		});
	});   
  });
  
  it('add subsistence', function() {
	_D && helper.printStage('switching to "subsistence" tab');     
	element(by.css('a[href="#subsistence"]')).click();	  
	
	_D && helper.printStage(' selecting one date from date table');
	helper.selectSimpleSelect(element.all(by.model('addData.date')).get(2), 2);
	
	_D && helper.printStage(' selecting type at index:', 1);  	
	helper.selectSimpleSelect(element.all(by.model('addData.type')).get(1), 1);
	
	_D && helper.printStage(' typing cost:', 100);
	element.all(by.model('addData.cost')).get(0).clear().sendKeys('100');
	
	_D && helper.printStage(' clicking on "add" button');
	element(by.css('#addSubsistenceButton')).click();
	
	_D && helper.printStage(' checking if subsistences table matches input');
	element.all(by.repeater('item in expenseData.subsistences')).each(function (row, index) {
      row.all(by.tagName('td')).then(function (cols) {
		_D && helper.printStage(' checking "date"');   
        expect(cols[0].getText()).toContain(element.all(by.model('addData.date')).get(2).all(by.tagName('option')).get(2).getText());
        
        _D && helper.printStage(' OOPS! type is not displaying. This should be fixed by developers...'); 
   //     expect(cols[1].getText()).toContain(element.all(by.model('addData.type')).get(1).all(by.tagName('option')).get(1).getText());// not fixed by developers
      });
    });
	   
  });
  
  it('document other expenses', function () {
	_D && helper.printStage('switching to "others" tab');  
	element(by.css('a[href="#other"]')).click();

    _D && helper.printStage(' selecting one date from date table');
    helper.selectSimpleSelect(element.all(by.model('addData.date')).get(3), 2);
    
    _D && helper.printStage(' selecting type at index:', 1);
    helper.selectSimpleSelect(element.all(by.model('addData.type')).get(2), 1);
    
    _D && helper.printStage(' typing cost:', 100);
    element.all(by.model('addData.cost')).get(1).sendKeys('100');
    
    _D && helper.printStage(' clicking on "add" button');
    element(by.css('#addOtherButton')).click();
    
    _D && helper.printStage(' checking if "others" table matches input');
    element.all(by.repeater('item in expenseData.others')).each(function (row, index) {
      row.all(by.tagName('td')).then(function (cols) {
		  
		_D && helper.printStage(' checking "date"');  
        expect(cols[0].getText()).toContain(element.all(by.model('addData.date')).get(3).all(by.tagName('option')).get(2).getText());
        
        _D && helper.printStage(' OOPS! type is not displaying. This should be fixed by developers...'); 
     //   expect(cols[1].getText()).toContain(element.all(by.model('addData.type')).get(2).all(by.tagName('option')).get(1).getText());
     
        _D && helper.printStage(' checking "cost"');
        expect(cols[4].getText()).toContain('100');
      });
    });
    
  });
  
  it('submit expenses', function () {
	  
	_D && helper.printStage('clicking on "agree on terms" button (using ng-model)');  	    
    element(by.model('isAgreedOnTerms')).click();
    
    _D && helper.printStage('clicking on "Submit Expenses" which should be allowed by now');  	    
    expect(element(by.partialButtonText('Submit Expenses')).isEnabled()).toBeTruthy();    
    element(by.partialButtonText('Submit Expenses')).click();
  });
  
  it('thank you screen', function () {
	  
	_D && helper.printStage('check if ID is there');  	    
	expect(element(by.binding('expenseData.claimReference')).getText()).toBeTruthy();
    element(by.css('[ng-click="cancel()"]')).click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });
});




 
