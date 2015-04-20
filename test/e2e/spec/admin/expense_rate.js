var helper = require('./../ui-helper.js');

var count=5;

describe('Going to check for sufficient expense rate count (at least 3)', function() {


  it('Getting expense rate url', function () {
    browser.get('/admin/expensesrate');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('expensesrate') !== -1);
      });
    });
  });


  it('Prefill expenses rates', function () {

    var addRate=function(i){

      $('[ng-click="openModal(\'expensesRate\')"]').click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();

      element(by.model('expensesRate.name')).sendKeys('Expense_rate_'+i);
      helper.selectSelector(element(by.model('expensesRate.expensesRateType')),i%2);
      element(by.model('expensesRate.amount')).sendKeys(6+i);

      $('[ng-click="save(expensesRateForm.$valid)"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();

    };


    element.all(by.repeater('expenserate in expensesRate')).count().then(function(n){
      if(n<count){
        console.log('there is items for adding count='+(count-n));
        for(var i=n+1;i<=count;i++){
          console.log('adding payment number '+i);
          addRate(i);
        };
      }else{
        console.log('nothing to add');
      }
      element.all(by.repeater('expenserate in expensesRate')).count().then(function(n) {
        expect(n >= count).toBeTruthy();
      });
    });
  });

});
