describe('KTest', function() {
  
  it('should login', function() {
    browser.get('http://localhost:9000');
    browser.setLocation('/register/home');
    element(by.model('emailAddress')).sendKeys('ishwor@makeitsimple.info');
    element(by.model('password')).sendKeys('passw0rd');
    element(by.css('.btn-singin')).click();
  });
  
  it('should click first candidate', function() {
    var el = element.all(by.repeater('row in options.data')).get(0);
    el.element(by.css('.fa-eye')).click();
  });
  
  it('should open the modal', function() {
    element(by.css('.fa-gbp')).click();
    element(by.cssContainingText('button', 'Expenses wizard')).click();
  });
  
  it('should select an agency', function() {
    element(by.cssContainingText('option', 'Marks')).click();
    element(by.cssContainingText('button', 'Next')).click();
  });
  
  it('should select a date', function() {
    element(by.cssContainingText('button', '12')).click();
    element(by.cssContainingText('button', 'Next')).click();
  });
  
  it('should add days', function() {
    element(by.cssContainingText('option', 'All dates')).click();
    element(by.cssContainingText('.button', 'Add')).click();
    element(by.cssContainingText('button', 'Next')).click();
  });
  
  it('should sleep', function() {
    browser.sleep(100);
  });
  
});