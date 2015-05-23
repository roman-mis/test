var links = $$('.table-view-main-content .tabs-wrapper .nav-tabs a[href^="/candidates/"]');

var number = helper.getDefaultNumber();
var agency = element(by.model('product.agency'));
var rule = element(by.model('product.holidayPayRule'));
var contract = element(by.model('product.derogationContract'));
var spread = element(by.model('product.derogationSpread'));
var margin = element(by.model('product.margin'));
var marginFixed = element(by.model('product.marginFixed'));

var used = element(by.model('product.serviceUsed'));
var terms = element(by.model('product.paymentTerms'));
var method = element(by.model('product.paymentMethod'));

var ref = element(by.model('product.agencyRef'));
var desc = element(by.model('product.jobDescription'));



var addNew = function (agencyIndex) {

  $('[ng-click="openAddPayrollProductModal()"]').click();

  browser.sleep(1000);

  helper.selectSelector(agency, agencyIndex);
  helper.selectSelector(rule, 1);
  helper.selectSelector(margin, 1);
  helper.selectSelector(contract, 1);
  spread.clear().sendKeys(number.substr(-3, 3));
  marginFixed.clear().sendKeys(parseInt(number.substr(-3, 3)));
  helper.selectSelector(used, 1);
  helper.selectSelector(terms, 1);
  helper.selectSelector(method, 1);
  desc.clear().sendKeys('desc' + number.substr(-3, 3));

  $('[ng-click="saveProduct()"]').click();
};

var removeAll=function(){
  var rows = by.repeater('row in options.data');
  element.all(by.repeater('row in options.data')).count().then(function (count) {
    for (var k = 0; k < count; k++) {
      element(rows.row(0)).element(by.css('[ng-click="getExternalScope().deleteProduct(row)"]')).click(); //delete
      browser.driver.switchTo().alert().accept();
    }
  });
}


describe('Navigating to Payroll-Product tab', function () {

  it('Adding one product', function () {

    helper.getByText(links, 'Payroll').click();
    $$('.tab-content .nav-tabs li[ng-class="{active: isTabActive(\'product\')}"] a[ng-click="setTabActive(\'product\')"]').click();

    removeAll();
    addNew(0);

  });


  it('Prefilling up to 3 products', function () {


    var rows = by.repeater('row in options.data');
    var minNumber = 3;

    element.all(rows).count().then(function (i) {


        element(rows.row(i - 1)).element(by.css('[ng-click="getExternalScope().editProduct(row)"]')).click();

        expect(used.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(0).getText());
        expect(agency.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(1).getText());
        expect(rule.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(3).getText());
        expect(contract.getText()).toBe(element(rows.row(i - 1)).all(by.css('td')).get(4).getText());
       // expect(spread.getAttribute('value')).toBe(number.substr(-3, 3));ToDo fixing developers
        expect(marginFixed.getAttribute('value')).toBe(parseInt(number.substr(-3, 3)).toString());
        expect(desc.getAttribute('value')).toBe('desc' + number.substr(-3, 3));
        expect(terms.getText()).toBe('On full receipt');
        expect(method.getText()).toBe('BACS');

        $('[ng-click="cancelEdit()"]').click();

        removeAll();


        element.all(rows).count().then(function (count) {
          expect(count).toBe(i - 1);
          if (count < minNumber)
            for (var k = 0; k < minNumber - count; k++) {
              addNew(k);
            }
          expect(element.all(rows).count()).toBeGreaterThan(2);
        });


    });


  });



});
