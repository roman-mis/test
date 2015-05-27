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
  
  it('Edit expenses rate', function(){
	  //! 'scanning columns in "expeses rate" table'
	  var column_names = {};
	  element(by.css('[ng-show="expensesRate"] + table')).all(by.css('th')).each(function(el, index){
		  el.getText().then(function(caption){
			  column_names['_' + caption] = index;
		  });
	  });
	  //! 'getting first "expenserate" object'
	  var expenserate = element.all(by.repeater('expenserate in expensesRate')).first();	  
	  //! 'opening "Edit Expense Rate" dialog by clicking on "edit" icon'
	  expenserate.all(by.css("[ng-click=\"openModal('expensesRate', $index)\"]")).get(0).click();	  
	  //! ' getting "td" columns of "expenserate" object'
	  expenserate.all(by.css('td')).then(function(cols){
		  //! ' cheking if ng-model:name took a name of "expense rate" object'
		  expect(element(by.model('expensesRate.name')).getAttribute('value')).toBe(cols[column_names._Name].getText());
		  //! ' checking if ng-model:amount value match'
		  element(by.model('expensesRate.amount')).getAttribute('value').then(function(value){
			  expect((value*1).toFixed(2)).toBe(cols[column_names._Amount].getText());
		  });
		  //! ' checking if ng-model:expenses_rate_type value match'
		  element(by.model('expensesRate.expensesRateType')).all(by.css('.ng-binding.ng-scope')).first().getText('value').then(function(value){
			  expect(value).toBe(cols[column_names['_Expenses Rate Type']].getText());
		  });
		  //! ' checking if ng-model:tax_applicable flag match'
		  element(by.model('expensesRate.taxApplicable')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names['_Tax Applicable']].getText());
		  });
		  //! ' checking if ng-model:vat flag match'
		  element(by.model('expensesRate.vat')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names._Vat].getText());
		  });
		  //! ' checking if ng-model:dispensation flag match'
		  element(by.model('expensesRate.dispensation')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names._Dispensation].getText());
		  });
		  //! ' checking if ng-model:receipted flag match'
		  element(by.model('expensesRate.receipted')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names._Receipted].getText());
		  });
		  //! ' checking if ng-model:isEnabled flag match'
		  element(by.model('expensesRate.isEnabled')).getAttribute('checked').then(function(value){
			  expect(value ? 'ON' : 'OFF').toBe(cols[column_names._Status].getText());
		  });
	  });
	  //! 'TODO: make "edit entries" test here'
	  //! 'make some backup before test will play with it'
	  var backup = {};
	  element(by.model('expensesRate.amount')).getAttribute('value').then(function(value){
          backup.amount = value;	
	  });
	  element(by.model('expensesRate.taxApplicable')).getAttribute('checked').then(function(value){
          backup.taxApplicable = !!value;
	  });
      element(by.model('expensesRate.vat')).getAttribute('checked').then(function(value){
          backup.vat = !!value;
      });
      element(by.model('expensesRate.dispensation')).getAttribute('checked').then(function(value){
          backup.dispensation = !!value;
      });
	  element(by.model('expensesRate.receipted')).getAttribute('checked').then(function(value){
          backup.receipted = !!value;
      });
      element(by.model('expensesRate.isEnabled')).getAttribute('checked').then(function(value){
          backup.isEnabled = !!value;
      });      
      browser.wait(function(){
		  //! 'change something'
		  var v = backup.amount*1+Math.floor(Math.random()*150);
		  var v_fixed = v.toFixed(2);
          element(by.model('expensesRate.amount')).clear().sendKeys(v_fixed);
          element(by.model('expensesRate.taxApplicable')).click();
          element(by.model('expensesRate.vat')).click();
          element(by.model('expensesRate.dispensation')).click();
          element(by.model('expensesRate.receipted')).click();
          element(by.model('expensesRate.isEnabled')).click();
          
          //! 'saving changes by clicking on button with css [ng-click="save(expensesRateForm.$valid)"]'
          element(by.css('[ng-click="save(expensesRateForm.$valid)"]')).click();
          
          browser.sleep(1000);
          browser.refresh();
          browser.sleep(1000);
          
          //! 'opening "edit expenses rate" dialog again'
          expenserate.all(by.css("[ng-click=\"openModal('expensesRate', $index)\"]")).get(0).click();
          
          //! 'check if changes are saved'
          //! ' checking if ng-model:amount value match'
		  element(by.model('expensesRate.amount')).getAttribute('value').then(function(value){
			  expect((value*1).toFixed(2)).toBe(v_fixed);
		  });
		  //! ' checking if ng-model:tax_applicable flag match'
		  element(by.model('expensesRate.taxApplicable')).getAttribute('checked').then(function(value){
			  expect(!!value).toBe(!backup.taxApplicable);
		  });
		  //! ' checking if ng-model:vat flag match'
		  element(by.model('expensesRate.vat')).getAttribute('checked').then(function(value){
			  expect(!!value).toBe(!backup.vat);
		  });
		  //! ' checking if ng-model:dispensation flag match'
		  element(by.model('expensesRate.dispensation')).getAttribute('checked').then(function(value){
			  expect(!!value).toBe(!backup.dispensation);
		  });
		  //! ' checking if ng-model:receipted flag match'
		  element(by.model('expensesRate.receipted')).getAttribute('checked').then(function(value){
			  expect(!!value).toBe(!backup.receipted);
		  });
		  //! ' checking if ng-model:isEnabled flag match'
		  element(by.model('expensesRate.isEnabled')).getAttribute('checked').then(function(value){
			  expect(!!value).toBe(!backup.isEnabled);
		  });
          return true;
	  });
	  //! 'restore backup'
	  browser.wait(function(){
          element(by.model('expensesRate.amount')).clear().sendKeys(backup.amount);
          element(by.model('expensesRate.taxApplicable')).click();
          element(by.model('expensesRate.vat')).click();
          element(by.model('expensesRate.dispensation')).click();
          element(by.model('expensesRate.receipted')).click();
          element(by.model('expensesRate.isEnabled')).click();
          return true;
	  });
	  //! 'closing "Edit Expense Rate" dialog by clicking on button with css [ng-click="cancel()"]'
	  element(by.css('[ng-click="cancel()"]')).click();
	  //! 'checking if dialog is disappeared'
	  expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
  });

});
