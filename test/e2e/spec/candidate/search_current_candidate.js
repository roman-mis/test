describe('Navigate to candidates url', function () {

  it('should navigate to page with login options ', function () {
    //browser.get('/candidates');
    $$('.main-menu a[href="/candidates"]').click();
  });

  it('should have working search engine', function () {
	  
    var items = element.all(by.repeater('row in options.data'));
    var initCount = items.count();

    var searchInput = element(by.model('searchText'));
    //searchInput.sendKeys(loginData.userEmail.split('@')[0]);
    searchInput.sendKeys('originemtest');

    expect(items.count()).toBeGreaterThan(0);
   // expect(items.count()).toBeLessThan(initCount);

  });

  it('should take to tabs', function () {
    element(by.repeater('row in options.data').row(0)).all(by.css('[ng-click="getExternalScope().viewDetails(row)"]')).first().click()

    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.match(/candidates\/.{24}/g));
      });
    }, 3000);

  });
});
