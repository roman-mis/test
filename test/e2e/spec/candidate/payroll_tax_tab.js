var links = $$('.candidate-tabs li a');
var helper = require('../ui-helper.js');

describe('Navigating to Payroll-Tax tab', function () {

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

    $('[ng-click="openTaxSetting()"]').click().then(function () {
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

    $('[ng-click="saveTax()"]').click().then(function () {
      expect($('.alert-success').isPresent()).toBeTruthy();
      expect($('.modal-content').isPresent()).toBeFalsy();
    });

    browser.getCurrentUrl().then(function (url) {
      browser.get(url);
    });
    innerLinks.get(1).click();
    $('[ng-click="openTaxSetting()"]').click().then(function () {
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

    $('[ng-click="cancel()"]').click().then(function () {
      expect($('.modal-content').isPresent()).toBeFalsy();
    });

  });

  it('Open payslips dialog', function () {
    $('[ng-click="openPayslipSetting()"]').click().then(function () {
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      $('.modal.fade').click().then(function () {
        expect($('.modal-content').isPresent()).toBeFalsy();
      });
    });
  });

});
