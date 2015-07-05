var count=5;

var expenserate = element.all(by.repeater('expenserate in expensesRate')).first();	

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
      helper.alertAccept();
      browser.sleep(2000);
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

describe('Editing existing expense rates', function(){
  
  it('check if table values match input models', function(){
	  //! 'scanning columns in "expeses rate" table'
	  var column_names = {};
	  element(by.css('[ng-show="expensesRate"] + table')).all(by.css('th')).each(function(el, index){
		  el.getText().then(function(caption){
			  column_names[caption.toLowerCase().replace(/\s+/g,'_')] = index;
		  });
	  });
	    
	  //! 'opening "Edit Expense Rate" dialog by clicking on "edit" icon'
	  expenserate.all(by.css("[ng-click=\"openModal('expensesRate', $index)\"]")).get(0).click();	  
	  //! ' getting "td" columns of "expenserate" object'
	  expenserate.all(by.css('td')).then(function(cols){
		  //! ' cheking if ng-model:name took a name of "expense rate" object'
		  expect(element(by.model('expensesRate.name')).getAttribute('value')).toBe(cols[column_names.name].getText());
		  //! ' checking if ng-model:amount value match'
		  element(by.model('expensesRate.amount')).getAttribute('value').then(function(value){
			  expect((value*1).toFixed(2)).toBe(cols[column_names.amount].getText());
		  });
		  //! ' checking if ng-model:expenses_rate_type value match'
		  element(by.model('expensesRate.expensesRateType')).all(by.css('.ng-binding.ng-scope')).first().getText('value').then(function(value){
			  expect(value).toBe(cols[column_names.expenses_rate_type].getText());
		  });
		  //! ' checking if ng-model:tax_applicable flag match'
		  element(by.model('expensesRate.taxApplicable')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names.tax_applicable].getText());
		  });
		  //! ' checking if ng-model:vat flag match'
		  element(by.model('expensesRate.vat')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names.vat].getText());
		  });
		  //! ' checking if ng-model:dispensation flag match'
		  element(by.model('expensesRate.dispensation')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names.dispensation].getText());
		  });
		  //! ' checking if ng-model:receipted flag match'
		  element(by.model('expensesRate.receipted')).getAttribute('checked').then(function(value){
			  expect(value ? 'Yes' : 'No').toBe(cols[column_names.receipted].getText());
		  });
		  //! ' checking if ng-model:isEnabled flag match'
		  element(by.model('expensesRate.isEnabled')).getAttribute('checked').then(function(value){
			  expect(value ? 'ON' : 'OFF').toBe(cols[column_names.status].getText());
		  });
	  });
   });
   it('changing data', function(){
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
          helper.alertAccept();
	      browser.sleep(2000);          
          browser.refresh();
          
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
      element(by.css('[ng-click="save(expensesRateForm.$valid)"]')).click();
      helper.alertAccept();
      browser.sleep(4000);
	  // /! 'closing "Edit Expense Rate" dialog by clicking on button with css [ng-click="cancel()"]'
	  //element(by.css('[ng-click="cancel()"]')).click();
	  //! 'checking if dialog is disappeared'
	  expect(element(by.css('.modal-content')).isPresent()).toBeFalsy();
  });

});
