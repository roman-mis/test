var helper = require('./../ui-helper.js');

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
        console.log('checking if element where added');
        expect(n >= count).toBeTruthy();
      });
    });
  });

});
