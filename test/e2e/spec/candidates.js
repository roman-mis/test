var helper = require('./ui-helper.js');

var tabs = $$('.candidate-tabs li');
var links = $$('.candidate-tabs li a');
var checkTabUrl = function (path) {
  browser.wait(function () {
    return browser.getCurrentUrl().then(function (url) {
      var re = new RegExp("candidates\/.{24}\/?" + path, 'g');
      return (url.match(re));
    });
  }, 3000);
};


describe('Navigate to candidates url', function () {

  it('should navigate to page with login options ', function () {
    browser.get('/candidates');
  });

  it('should have working search engine', function () {
    var items = element.all(by.repeater('row in options.data'));
    var initCount = items.count();

    var searchInput = element(by.model('filterFirstName'));
    searchInput.sendKeys(loginData.userName);

    expect(items.count()).toBeGreaterThan(0);
    expect(items.count()).toBeLessThan(initCount);

  });

  it('should take to tabs', function () {
    element(by.repeater('row in options.data').row(0)).element(by.css('[ng-click="getExternalScope().viewDetails(row)"]')).click()

    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.match(/candidates\/.{24}/g));
      });
    }, 3000);

  });
});

/*

describe('navigate to users tabs', function () {

  it('check if tabs working', function () {

    expect(tabs.count()).toBe(7);


    expect(tabs.get(0).getText()).toBe('Home');
    links.get(0).click();
    expect(tabs.get(0).getAttribute('class')).toContain('active');
    checkTabUrl('');

    expect(tabs.get(1).getText()).toBe('Contact');
    links.get(1).click();
    expect(tabs.get(1).getAttribute('class')).toContain('active');
    checkTabUrl('contact');

    expect(tabs.get(2).getText()).toBe('Payroll');
    links.get(2).click();
    checkTabUrl('payroll');


    expect(tabs.get(3).getText()).toBe('Payslips');
    links.get(3).click();
    checkTabUrl('payslips');

    expect(tabs.get(4).getText()).toBe('Agencies');
    links.get(4).click();
    checkTabUrl('agencies');

    expect(tabs.get(5).getText()).toBe('Compliance');
    links.get(5).click();
    checkTabUrl('compliance');

    expect(tabs.get(6).getText()).toBe('History');
    links.get(6).click();
    checkTabUrl('history');

  });


  it('contact tab should be working', function () {


    var editLink1 = $('[ng-click="openPrimaryAddressEdit()"]');
    var editLink2 = $('[ng-click="openPrimaryContactEdit()"]');
    var editLink3 = $('[ng-click="openBankDetailsEdit()"]');

    links.get(1).click();

    var testDialog = function (link) {
      var cancelBtn = $('.modal-content [ng-click="cancel()"]');

      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      cancelBtn.click();
      expect($('.modal-content').isPresent()).toBeFalsy();
    }

    testDialog(editLink1);
    testDialog(editLink2);
    testDialog(editLink3);

    /// data fill test
    var number = helper.getDefaultNumber();
    var inputs = element.all(by.css('.modal-content input'));
    var saveBtn = $('.modal-content [ng-click="ok()"]');


    /// First dialog
    editLink1.click();

    inputs.get(0).clear();
    inputs.get(0).sendKeys('Address1_' + number);
    inputs.get(1).clear();
    inputs.get(1).sendKeys('Address2_' + number);
    inputs.get(2).clear();
    inputs.get(2).sendKeys('Address3_' + number);
    helper.selectSelector($('.modal-content .select2'), 1);
    saveBtn.click();

    expect($('[ng-show="contactDetail.address1"]').getText()).toBe('Address1_' + number);
    expect($('[ng-show="contactDetail.address2"]').getText()).toBe('Address2_' + number);
    expect($('[ng-show="contactDetail.address3"]').getText()).toBe('Address3_' + number);
    expect($('[ng-show="contactDetail.nationality"]').getText()).toBe('Afghan');


    /// Second dialog
    editLink2.click();

    inputs.get(0).clear();
    inputs.get(0).sendKeys('+44777' + number);
    inputs.get(1).clear();
    inputs.get(1).sendKeys('+44778' + number);
    inputs.get(3).clear();
    inputs.get(3).sendKeys('boojaka+r' + number + '@gmail.com');
    inputs.get(4).clear();
    inputs.get(4).sendKeys('https://www.facebook.com/boojaka' + number);
    inputs.get(5).clear();
    inputs.get(5).sendKeys('https://www.linkedin.com/profile/view?id=16' + number);
    saveBtn.click();

    var labels = element.all(by.css('span.meta'));
    expect(labels.get(0).getText()).toBe('+44777' + number);
    expect(labels.get(1).getText()).toBe('+44778' + number);
    expect(labels.get(3).getText()).toBe('boojaka+r' + number + '@gmail.com');
    expect(labels.get(4).getText()).toBe('https://www.facebook.com/boojaka' + number);
    expect(labels.get(5).getText()).toBe('https://www.linkedin.com/profile/view?id=16' + number);


    /// Second dialog
    editLink3.click();

    inputs.get(0).clear();
    inputs.get(0).sendKeys('Bank_' + number);
    inputs.get(1).clear();
    inputs.get(1).sendKeys('RBS_' + number);
    inputs.get(2).clear();
    inputs.get(2).sendKeys('81' + number);
    inputs.get(3).clear();
    inputs.get(3).sendKeys(number);
    inputs.get(4).clear();
    inputs.get(4).sendKeys(number);
    saveBtn.click();

    var labels = element.all(by.css('span.meta-o'));

    expect(labels.get(0).getText()).toBe('Bank_' + number);
    expect(labels.get(1).getText()).toBe('RBS_' + number);
    expect(labels.get(2).getText()).toBe('81' + number);
    expect(labels.get(3).getText()).toBe(number);
    expect(labels.get(4).getText()).toBe(number);
  });
});


describe('navigate to candidate\'s tabs', function () {

  var innerTabs = $$('.tabs-payroll .nav-tabs li');
  var innerLinks = $$('.tabs-payroll .nav-tabs li a');
  var tabContents = $$('.tabs-payroll .tab-content');


  it('payroll tab should be working', function () {

    links.get(2).click();
    var checkInnerTabs = function (i) {
      innerLinks.get(i).click();
      expect(innerTabs.get(i).getAttribute('class')).toContain('active');
      expect(tabContents.get(i).isDisplayed()).toBeTruthy();
    };

    for (var i = 0; i < 3; i++) {
      checkInnerTabs(i);
    }


    ///Check Tax subtab
    innerLinks.get(1).click();
    var decl = element(by.model('tax.declaration'));
    helper.selectSelector(decl, 0);

    var number = helper.getDefaultNumber();
    var input1 = element(by.model('tax.p45GrossTax'));
    input1.clear();
    input1.sendKeys(number.substr(-3, 3));

    var input2 = element(by.model('tax.p45TaxDeducted'));
    input2.clear();
    input2.sendKeys(number.substr(-3, 3));

    var date = helper.getDateByModel('tax.startDate');
    date.clear();
    date.sendKeys('26/01/2012');
    var freq = element(by.model('tax.payFrequency'));
    helper.selectSelector(freq, 2);

    var ni = element(by.model('tax.niNumber'));
    ni.clear();
    ni.sendKeys('JT' + number + 'D');

    var code = element(by.model('tax.taxCode'));
    code.clear();
    code.sendKeys(number.substr(-2, 2));

    var basis = element(by.model('tax.taxBasis'));
    helper.selectSelector(basis, 1);

    $('[ng-click="saveTax()"]').click();

    //ensure changes saves
    browser.getCurrentUrl().then(function (url) {
      browser.get(url);
    });
    innerLinks.get(1).click();

    expect(decl.getText()).toBe('Not Applicable');
    expect(input1.getAttribute('value')).toBe(number.substr(-3, 3));
    expect(input2.getAttribute('value')).toBe(number.substr(-3, 3));
    expect(date.getAttribute('value')).toBe('26/01/2012');
    expect(freq.getText()).toBe('4 Weekly');
    expect(ni.getAttribute('value')).toBe('JT' + number + 'D');
    expect(code.getAttribute('value')).toBe(number.substr(-2, 2));
    expect(basis.getText()).toBe('W1/M1');

  });


  it('payroll tab should be working', function () {
    //  browser.get('/candidates/548af0d1f1ffa56c251ff15f/payroll');
    innerLinks.get(2).click();

    var number = helper.getDefaultNumber();

    var agency = element(by.model('product.agency'));
    helper.selectSelector(agency, 1);

    var margin = element(by.model('product.margin'));
    helper.selectSelector(margin, 1);


    var fixed = element(by.model('product.marginFixed'));
    fixed.clear();
    fixed.sendKeys(number.substr(-3, 3));

    var rule = element(by.model('product.holidayPayRule'));
    helper.selectSelector(rule, 1);

    var contract = element(by.model('product.derogationContract'));
    helper.selectSelector(contract, 1);


    var spread = element(by.model('product.derogationSpread'));
    spread.clear();
    spread.sendKeys(number.substr(-3, 3));

    var used = element(by.model('product.serviceUsed'));
    helper.selectSelector(used, 1);

    var terms = element(by.model('product.paymentTerms'));
    helper.selectSelector(terms, 1);

    var method = element(by.model('product.paymentMethod'));
    helper.selectSelector(method, 1);

    var desc = element(by.model('product.jobDescription'));
    desc.clear();
    desc.sendKeys('desc' + number.substr(-3, 3));

    $('[ng-click="saveProduct()"]').click();


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

    element.all(rows).count().then(function (i) {

      // Edit icon click
      element(rows.row(i - 1)).element(by.css('[ng-click="getExternalScope().editProduct(row)"]')).click();

      expect(agency.getText()).toBe('XYZ Agency');
      expect(margin.getText()).toBe('Fixed Fee');
      expect(fixed.getAttribute('value')).toBe(number.substr(-3, 3));
      expect(rule.getText()).toBe('Holiday Pay Retained');
      expect(contract.getText()).toBe('Opt-in');
      expect(spread.getAttribute('value')).toBe(number.substr(-3, 3));
      expect(used.getText()).toBe('PAYE');
      expect(terms.getText()).toBe('On full receipt');
      expect(method.getText()).toBe('BACS');
      expect(desc.getAttribute('value')).toBe('desc' + number.substr(-3, 3));

      element(rows.row(i - 1)).element(by.css('[ng-click="getExternalScope().deleteProduct(row)"]')).click();

      expect(element.all(rows).count()).toBe(i - 1);
    });


  });

});




*/
