var helper = require('./ui-helper.js');


describe('Getting first agency properties', function () {


  it('getting /agencies url', function () {
    browser.get('/agencies');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('agencies') !== -1);
      });
    });
  });

  it('selecting first agency in the list', function () {
    element(by.repeater('row in options.data').row(0)).element(by.css('td>a')).click();
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.match(/agencies\/.{24}/g));
      });
    }, 3000);
  });

});

var links = $$('.nav-tabs li a');
var checkTabUrl = function (path) {
  browser.wait(function () {
    return browser.getCurrentUrl().then(function (url) {
      var re = new RegExp("agencies\/.{24}\/?" + path, 'g');
      return (url.match(re));
    });
  }, 3000);
};

describe('Getting first agency properties', function () {


  it('checking tabs consistency', function () {

    expect(links.get(0).getText()).toBe('Home');
    expect(links.get(1).getText()).toBe('Payroll');
    expect(links.get(2).getText()).toBe('Consultants');
    expect(links.get(3).getText()).toBe('Candidates');
    expect(links.get(4).getText()).toBe('Sales');
    expect(links.get(5).getText()).toBe('History');
    expect(links.get(6).getText()).toBe('Other');

    links.get(0).click();
    checkTabUrl('');
    links.get(1).click();
    checkTabUrl('payroll');
    links.get(2).click();
    checkTabUrl('consultants');
    links.get(3).click();
    checkTabUrl('candidates');
    links.get(4).click();
    checkTabUrl('sales');
    links.get(5).click();
    checkTabUrl('history');
    links.get(6).click();
    checkTabUrl('other');

  });

  it('selecting first agency in the list', function () {

  });

});

describe('Editing home tab info', function () {

  var inputs = element.all(by.css('.modal-content input'));

  var number = helper.getDefaultNumber();
  var saveBtn = $('.modal-content [ng-click="ok()"]');

  it('checking tabs consistency', function () {

    links.get(0).click();


    $('[ng-click="openAgencyEdit()"]').click();
    inputs.get(0).clear().sendKeys('Agency Name_' + number);
    inputs.get(1).clear().sendKeys('Address1_' + number);
    inputs.get(2).clear().sendKeys('Address2_' + number);
    inputs.get(3).clear().sendKeys('Address3_' + number);
    inputs.get(4).clear().sendKeys('Town_' + number);
    helper.selectSelector($('.modal-content .select2'), 0);
    inputs.get(7).clear().sendKeys('E22 2EE');
    inputs.get(8).clear().sendKeys(number);
    inputs.get(9).clear().sendKeys(number);
    saveBtn.click();


    $('[ng-click="openContactEdit()"]').click();
    inputs.get(0).clear().sendKeys(number);
    inputs.get(1).clear().sendKeys(number);
    inputs.get(2).clear().sendKeys(number);
    inputs.get(3).clear().sendKeys('facebook.com/' + number);
    inputs.get(4).clear().sendKeys('linkedin.com/' + number);
    inputs.get(5).clear().sendKeys('website.com');
    inputs.get(6).clear().sendKeys('super@email.com');
    saveBtn.click();

    var labels = element.all(by.css('.meta'));

    expect(labels.get(0).getText()).toBe('Agency Name_' + number);
    expect(labels.get(1).getText()).toBe('Address1_' + number);
    expect(labels.get(2).getText()).toBe('Address2_' + number);
    expect(labels.get(3).getText()).toBe('Address3_' + number);
    expect(labels.get(4).getText()).toBe('Town_' + number);
    expect(labels.get(5).getText()).toBe('United Kingdom');
    expect(labels.get(6).getText()).toBe('E22 2EE');
    expect(labels.get(7).getText()).toBe(number);
    expect(labels.get(8).getText()).toBe(number);
    expect(labels.get(9).getText()).toBe(number);
    expect(labels.get(10).getText()).toBe(number);
    expect(labels.get(11).getText()).toBe(number);
    expect(labels.get(12).getText()).toBe('facebook.com/' + number);
    expect(labels.get(13).getText()).toBe('linkedin.com/' + number);
    expect(labels.get(14).getText()).toBe('website.com');
    expect(labels.get(15).getText()).toBe('super@email.com');

  });


});

describe('Editing payroll tab info', function () {

  var inputs = element.all(by.css('.modal-content input'));

  var number = helper.getDefaultNumber();
  var saveBtn = $('.modal-content [ng-click="ok()"]');

  it('fill in first panel info', function () {

    links.get(1).click();

    $('[ng-click="openAgencyDefaultInvoicing()"]').click();
    element.all(by.css('.switch_wrap input[type="checkbox"]:checked')).each(function (el, i) {
      el.element(by.xpath('..')).element(by.css('.bullet')).click();
    });

    element(by.model('data.invoiceEmailPrimary')).clear().sendKeys('primary@email.com');
    element(by.model('data.invoiceEmailSecondary')).clear().sendKeys('secondary@email.com');

    helper.selectSimpleSelect(element(by.model('data.paymentTerms')), 0);
    helper.selectSimpleSelect(element(by.model('data.invoiceMethod')), 0);
    helper.selectSimpleSelect(element(by.model('data.invoiceDesign')), 0);
    saveBtn.click();

    var labels = element.all(by.css('.meta-o'));

    expect(labels.get(0).getText()).toBe('No');
    expect(labels.get(1).getText()).toBe('No');
    expect(labels.get(2).getText()).toBe('No');
    expect(labels.get(3).getText()).toBe('Consolidate by Import');
    expect(labels.get(5).getText()).toBe('On partial receipt');

    var labels2 = element.all(by.css('.meta'));
    expect(labels2.get(0).getText()).toBe('primary@email.com');
    expect(labels2.get(1).getText()).toBe('secondary@email.com');

  });

  it('fill in first panel info', function () {

    links.get(1).click();

    $('[ng-click="openAgencyDefaultPayroll()"]').click();
    element.all(by.css('.switch_wrap input[type="checkbox"]:checked')).each(function (el, i) {
      el.element(by.xpath('..')).element(by.css('.bullet')).click();
    });

    element(by.model('data.marginAmount')).clear().sendKeys('5');
    element(by.model('data.holidayAmount')).clear().sendKeys('19');

    helper.selectSimpleSelect(element(by.model('data.productType')), 0);
    helper.selectSimpleSelect(element(by.model('data.marginType')), 0);
    saveBtn.click();

    var labels = element.all(by.css('.meta-o'));

    expect(labels.get(7).getText()).toBe('Umbrella');
    expect(labels.get(8).getText()).toBe('No');
    expect(labels.get(9).getText()).toBe('Use contractor rules');
    expect(labels.get(10).getText()).toBe('£5');
    expect(labels.get(11).getText()).toBe('19%');


  });

});
