var links = $$('.candidate-tabs li a');
var helper = require('../ui-helper.js');

describe('Navigating to Payroll tabs', function () {

  var innerTabs = $$('.tabs-payroll .nav-tabs li');
  var innerLinks = $$('.tabs-payroll .nav-tabs li a');
  var tabContents = $$('.tabs-payroll .tab-content');


  it('if inner tabs are working', function () {

    links.get(2).click();
    var checkInnerTabs = function (i) {
      innerLinks.get(i).click();
      expect(innerTabs.get(i).getAttribute('class')).toContain('active');
      expect(tabContents.get(i).isDisplayed()).toBeTruthy();
    };

    for (var i = 0; i < 3; i++) {
      checkInnerTabs(i);
    }
  });

  it('Tax subtab data entry', function () {
    ///Check Tax subtab
    innerLinks.get(1).click();

    $('[ng-click="openTaxSetting()"]').click().then(function(){
      expect($('.modal-content').isDisplayed()).toBeTruthy();
    });



    var decl = element(by.model('tax.declaration'));
    helper.selectSelector(decl, 0);

    var number = helper.getDefaultNumber();
    var input1 = element(by.model('tax.p45GrossTax'));
    input1.clear();
    input1.sendKeys(parseInt(number.substr(-3, 3)));

    var input2 = element(by.model('tax.p45TaxDeducted'));
    input2.clear();
    input2.sendKeys(parseInt(number.substr(-3, 3)));

    var date = helper.getDateByModel('tax.startDate');
    date.clear().sendKeys('26/01/2012');

    var freq = element(by.model('tax.payFrequency'));
    helper.selectSelector(freq, 2);

    var niPad = element(by.model('tax.employeesNIpaid'));
    helper.selectSelector(niPad, 1);

    var ni = element(by.model('tax.niNumber'));
    ni.clear().sendKeys('AB123456C');

    var code = element(by.model('tax.taxCode'));
    code.clear().sendKeys(parseInt(number.substr(-2, 2)));

    var basis = element(by.model('tax.taxBasis'));
    helper.selectSelector(basis, 1);

    $('[ng-click="saveTax()"]').click().then(function(){
      expect($('.alert-success').isPresent()).toBeTruthy();
      expect($('.modal-content').isPresent()).toBeFalsy();
    });

    browser.getCurrentUrl().then(function (url) {
      browser.get(url);
    });
    innerLinks.get(1).click();
    $('[ng-click="openTaxSetting()"]').click().then(function(){
      expect($('.modal-content').isDisplayed()).toBeTruthy();
    });

    expect(decl.getText()).toBe('Not Applicable');
    expect(input1.getAttribute('value')).toBe(String(parseInt(number.substr(-3, 3))));
    expect(input2.getAttribute('value')).toBe(String(parseInt(number.substr(-3, 3))));
    expect(date.getAttribute('value')).toBe('26/01/2012');
    expect(freq.getText()).toBe('4 Weekly');
    expect(ni.getAttribute('value')).toBe('AB123456C');
    expect(code.getAttribute('value')).toBe(String(parseInt(number.substr(-2, 2))));
    expect(basis.getText()).toBe('W1/M1');

    $('[ng-click="cancel()"]').click().then(function(){
      expect($('.modal-content').isPresent()).toBeFalsy();
    });

  });

/*

  it('product tab should be working', function () {

    innerLinks.get(2).click();

    var number = helper.getDefaultNumber();

    var agency = element(by.model('product.agency'));
    var margin = element(by.model('product.margin'));
    var fixed = element(by.model('product.marginFixed'));
    var rule = element(by.model('product.holidayPayRule'));
    var contract = element(by.model('product.derogationContract'));
    var spread = element(by.model('product.derogationSpread'));
    var used = element(by.model('product.serviceUsed'));
    var terms = element(by.model('product.paymentTerms'));
    var method = element(by.model('product.paymentMethod'));
    var desc = element(by.model('product.jobDescription'));

    var addNew=function(agencyIndex){
      helper.selectSelector(agency, agencyIndex);
      helper.selectSelector(margin, 1);
      fixed.clear();
      fixed.sendKeys(number.substr(-3, 3));
      helper.selectSelector(rule, 1);
      helper.selectSelector(contract, 1);
      spread.clear();
      spread.sendKeys(number.substr(-3, 3));
      helper.selectSelector(used, 1);
      helper.selectSelector(terms, 1);
      helper.selectSelector(method, 1);
      desc.clear();
      desc.sendKeys('desc' + number.substr(-3, 3));

      $('[ng-click="saveProduct()"]').click();


    };

    addNew(0);


    expect(agency.getText()).toBe('');
    expect(margin.getText()).toBe('');
    expect(fixed.getAttribute('value')).toBe('');
    expect(rule.getText()).toBe('');
    expect(contract.getText()).toBe('');
    expect(spread.getAttribute('value')).toBe('');
    expect(used.getText()).toBe('');
    expect(terms.getText()).toBe('');
    expect(method.getText()).toBe('');
    expect(desc.getAttribute('value')).toBe('');

    var rows = by.repeater('row in options.data');
    var count = 0;
    var minNumber=3;

    element.all(rows).count().then(function (i) {

      // Edit icon click
      element(rows.row(i - 1)).element(by.css('[ng-click="getExternalScope().editProduct(row)"]')).click();

      expect(used.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(0).getText());
      expect(agency.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(1).getText());
      expect(margin.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(2).getText());
      expect(rule.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(3).getText());
      expect(contract.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(4).getText());
      expect(fixed.getAttribute('value')).toBe(String(parseInt(number.substr(-3, 3))));
      expect(spread.getAttribute('value')).toBe(number.substr(-3, 3));
      expect(desc.getAttribute('value')).toBe('desc' + number.substr(-3, 3));

      expect(terms.getText()).toBe('On full receipt');
      expect(method.getText()).toBe('BACS');


      element(rows.row(i - 1)).element(by.css('[ng-click="getExternalScope().deleteProduct(row)"]')).click();
      $('[ng-click="cancelEdit()"]').click();

      element.all(rows).count().then(function(count){
        expect(count).toBe(i - 1);
        if(count<minNumber)
          for(var k=0;k<minNumber-count;k++){
            addNew(k);
          }

        expect(element.all(rows).count()).toBeGreaterThan(2);
      });


    });

  });
*/

});
