var count=3;

describe('Going to check for sufficient payment rate count (at least 3)', function() {


  it('Getting payment rate url', function () {
    browser.get('/admin/paymentrates');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('paymentrates') !== -1);
      });
    });
  });


  it('Prefill payment rates', function () {

    var addRate=function(i){

      $('[ng-click="openModal(\'paymentRates\')"]').click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();

      element(by.model('paymentRates.name')).sendKeys('Payment_rate_'+i);
      helper.selectSelector(element(by.model('paymentRates.rateType')),1);
      element(by.model('paymentRates.hours')).sendKeys(8+i);

      $('[ng-click="save(addPaymentForm.$valid)"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();

    };


    element.all(by.repeater('payrate in paymentRates')).count().then(function(n){
      if(n<count){
        console.log('there is items for adding count='+(count-n));
        for(var i=1;i<=count-n;i++){
          console.log('adding payment number '+i);
          addRate(i);
        };
      }else{
        console.log('nothing to add');
      }
      element.all(by.repeater('payrate in paymentRates')).count().then(function(n) {
        expect(n >= count).toBeTruthy();
      });
    });
  });
  
  it('Edit payment rates', function(){
	  
	  var number = helper.getDefaultNumber();
	  
	  var rateType;
	  
	  var row = element.all(by.repeater('payrate in paymentRates')).first();
	  
	  row.element(by.css('a.icon-edit')).click();
	  
	  expect($('.modal-content').isPresent()).toBeTruthy();
	  
	  element(by.model('paymentRates.name')).clear().sendKeys('test_' + number);
	  
	  helper.selectSelector(element(by.model('paymentRates.rateType')), 0);
	  
	  element(by.model('paymentRates.rateType')).getText().then(function(v){
		  rateType = v;
	  });
	  
	  element(by.model('paymentRates.hours')).clear().sendKeys('22');
	  
	  element.all(by.model('paymentRates.importAliases[$index+1]')).then(function(aliases){
		for(var i = aliases.length - 1; i >= 0; i--)
		{
          aliases[i].clear();
          !i && aliases[i].sendKeys('alias_' + number);
		}
	  });
	  
	  $('[ng-click="save(addPaymentForm.$valid)"]').click();
	  
	  expect($('.modal-content').isPresent()).toBeFalsy();
	  
	  browser.refresh();
	  
	  //! 'check data in dialog'
	  
	  row.element(by.css('a.icon-edit')).click();
	  
	  expect($('.modal-content').isPresent()).toBeTruthy();
	  
	  expect(element(by.model('paymentRates.name')).getAttribute('value')).toBe('test_' + number);
	  
	  browser.wait(function(){	  
		expect(element(by.model('paymentRates.rateType')).getText()).toBe(rateType);
		return true;
	  });
	  
	  expect(element(by.model('paymentRates.hours')).getAttribute('value')).toBe('22');
	  
	  element.all(by.model('paymentRates.importAliases[$index+1]')).then(function(aliases){
		expect(aliases.length).toBe(2);
        aliases.length && expect(aliases[0].getAttribute('value')).toBe('alias_' + number);
	  });
	  
	  $('[ng-click="cancel()"]').click();
	  
	  expect($('.modal-content').isPresent()).toBeFalsy();
	  
	  //! 'check data in table'
	  
	  expect(row.element(by.css('td:nth-child(1)')).getText()).toBe('test_' + number);
	  browser.wait(function(){
		expect(row.element(by.css('td:nth-child(2)')).getText()).toBe(rateType);
		return true;
	  });
	  
	  expect(row.element(by.css('td:nth-child(3)')).getText()).toBe('22');
	  
	  expect(row.element(by.css('td:nth-child(4)')).getText()).toBe('alias_' + number);
	  
  });

});
