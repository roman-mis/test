var links = $$('.table-view-main-content .tabs-wrapper .nav-tabs a[href^="/candidates/"]');

describe('Checking AGENCIES tab', function (){
  it('Sufficient agency count',function(){
 //   browser.driver.get('http://originempayroll-qa.elasticbeanstalk.com/candidates/54d8b6fed7672edf6a63dfbc/agencies');
    helper.getByText(links, 'Agencies').click();
    expect(element.all(by.repeater('product in payrollProducts')).count()).toBeGreaterThan(2);
  });

  var addLink=element.all(by.css('.panel-collapse.in')).first().all(by.css('[ng-click^="openAgenciesAddingMargin"]')).first();
  var rows=element.all(by.css('.panel-collapse.in')).first().all(by.repeater('exception in product.marginException'));

  it('Agencies should have working add Margin dialog', function () {

    $$('.panel-collapse.in').count().then(function(i){
      if(i==0){
        console.log('waringing: tabs initially closed');
        $$('[ng-click="toggleOpen()"]').first().click();
      }
      browser.sleep(1000);
      addLink.click();      

      expect($('.modal-content').isDisplayed()).toBeTruthy();
      $('.modal-content [ng-click="cancel()"]').click();
      helper.alertAccept();
      browser.sleep(1000);
      expect($('.modal-content').isPresent()).toBeFalsy();

    });

  });
 it('Checking Margin data entry dialog',function(){


       rows.count().then(function(i){
      addLink.click();
      helper.selectSelector(element(by.model('data.marginType')), 1);
      helper.selectSelector(element(by.model('data.reason')), 1);
      helper.selectSelector(element(by.model('data.deductionType')), 2);
      element(by.model('data.deductionNumberOfPayroll')).sendKeys('123');
      $('[ng-click="saveException()"]').click();
      helper.alertAccept();      
      expect(rows.count()).toBe(i+1);
    });

  });

  it('Checking if margins are editable',function(){

    rows.first().all(by.css('[ng-click="openAgenciesAddingMargin(product, exception)"]')).get(0).click();
    expect($('.modal-content').isDisplayed()).toBeTruthy();

    expect(element(by.model('data.reason')).getText()).toBe(rows.first().all(by.css('td')).get(0).getText());
    expect( element(by.model('data.deductionType')).getText()).toBe(rows.first().all(by.css('td')).get(1).getText());

    element(by.model('data.deductionNumberOfPayroll')).clear().sendKeys('321');
    $('[ng-click="saveException()"]').click();
    helper.alertAccept();

    expect('321').toBe(rows.first().all(by.css('td')).get(4).getText());
  });

  it('Checking if margins could be deleted',function(){
    rows.count().then(function(i){
      rows.first().all(by.css('[ng-click="deleteMarginException(product, exception)"]')).get(0).click();
      helper.alertAccept();
      expect(rows.count()).toBe(i-1);
    });
  });

});
