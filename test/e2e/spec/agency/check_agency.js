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
    element(by.repeater('row in options.data').row(0)).element(by.css('td:first-child')).click();
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
	//! 'checking link names'
    expect(links.get(0).getText()).toBe('Home');
    expect(links.get(1).getText()).toBe('Payroll');
    expect(links.get(2).getText()).toBe('Consultants');
    expect(links.get(3).getText()).toBe('Candidates');
    expect(links.get(4).getText()).toBe('Sales');
    expect(links.get(5).getText()).toBe('History');
    expect(links.get(6).getText()).toBe('Other');
	//! 'checking Home url address'
    links.get(0).click();
    checkTabUrl('');
    //! 'checking Payroll url address'
    links.get(1).click();
    checkTabUrl('payroll');
    //! 'checking Consultants url address'
    links.get(2).click();
    checkTabUrl('consultants');
    //! 'checking Candidates url address'
    links.get(3).click();
    checkTabUrl('candidates');
    //! 'checking Sales url address'
    links.get(4).click();
    checkTabUrl('sales');
    //! 'checking History url address'
    links.get(5).click();
    checkTabUrl('history');
    //! 'checking Other url address'
    links.get(6).click();
    checkTabUrl('other');

  });
});

/*
describe('Editing sales tab', function () {

  var number = helper.getDefaultNumber();


  it('filling sales info', function () {

    links.get(4).click();
    //
    helper.selectSimpleSelect(element(by.model('data.sales.leadSales')),1);
    helper.selectSimpleSelect(element(by.model('data.sales.accountManager')),1);
    helper.selectSimpleSelect(element(by.model('data.sales.commisionProfile')),1);

    element(by.model('data.administrationCost.perReferral')).clear().sendKeys(parseInt(number.substr(-3, 3)));
    element(by.model('data.administrationCost.perTimesheet')).clear().sendKeys(parseInt(number.substr(-3, 3)));
    element(by.model('data.administrationCost.timesheetGross')).clear().sendKeys(parseInt(number.substr(-3, 3)));

    $('[ng-click="save()"]').click();
  });

});*/

/* TODO CHECK MAILBOX email on chanching pass agency-consultant tab*/
