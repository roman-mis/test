describe('KTest', function() {
  //HOUSEKEEPING
  browser.driver.manage().window().setSize(1050,850);
  browser.driver.manage().window().setPosition(0,0);
  var selectSelector=function(selectAll,item){
    selectAll.all(by.css('[ng-click="$select.toggle($event)"]')).get(0).click();
    selectAll.all(by.css('[ng-click="$select.select(item,false,$event)"]')).get(item).click();
  };
  
  //TESTS START HERE
  it('should login', function() {
    browser.get('http://localhost:9000');
    browser.setLocation('/register/home');
    element(by.model('emailAddress')).sendKeys('ishwor@makeitsimple.info');
    element(by.model('password')).sendKeys('passw0rd');
    element(by.css('.sign-in')).click();
  });
  
  it('should click first candidate', function() {
    var el = element.all(by.repeater('row in options.data')).get(0);
    el.element(by.css('.fa-eye')).click();
  });
  
  it('should open the modal', function() {
    element(by.css('.fa-gbp')).click();
    element(by.cssContainingText('button', 'Expenses wizard')).click();
  });
  
  /*it('should select an agency', function() {
    var select = element.all(by.model('expenseData.agency'));
    selectSelector(select, 0);
    element(by.cssContainingText('button', 'Next')).click();
  });
  
  it('should select a date', function() {
    element.all(by.cssContainingText('td', '15')).get(1).click();
    element(by.cssContainingText('button', 'Next')).click();
  });
  
  it('should add days', function() {
    element(by.cssContainingText('option', 'All dates')).click();
    element(by.cssContainingText('.btn-default.form-control', 'Add')).click();
    element(by.cssContainingText('button', 'Next')).click();
  });
  
  it('should add travel', function() {
    element(by.cssContainingText('button', 'Next')).click();
  });
  it('should add transport', function() {
    element(by.cssContainingText('button', 'Next')).click();
  });
  it('should add subsistence', function() {
    element.all(by.cssContainingText('button', 'Next')).get(0).click();
  });
  it('should add other', function() {
    element(by.cssContainingText('option', 'Mon')).click();
    element(by.cssContainingText('option', 'Training')).click();
    element(by.model('addData.cost')).sendKeys('333');
    element(by.cssContainingText('.btn-default.form-control', 'Add')).click();    
    element.all(by.cssContainingText('button', 'Next')).get(0).click();
    
  });*/
  
  it('should sleep', function() {
    browser.sleep(1000000);
  });
  
});