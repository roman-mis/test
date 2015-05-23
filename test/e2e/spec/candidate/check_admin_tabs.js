var tabs = $$('.nav-tabs li');
var links = $$('.nav-tabs li a');

describe('Navigate to users tabs', function () {

  var checkTabUrl = function (path) {
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        var re = new RegExp("candidates\/.{24}\/?" + path, 'g');
        return (url.match(re));
      });
    }, 3000);
  };

  it('tabs should change url after click and amount of 7', function () {

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

});
