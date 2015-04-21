var number = helper.getDefaultNumber();
var count=3;

describe('Checking agency for sufficient count', function() {


  it('getting /agencies url', function () {
    browser.get('/agencies');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('agencies') !== -1);
      });
    });
  });
  it('count agencies in the table', function () {
    var addBtn=$('[ng-click="openAddAgencyWin()"]');
    var agenciesNames=['Sumertime agency','Woodoo agency','Kengoo Agency','Bogart Int','Slimshady Agency']
    var addAgency=function(i){
      addBtn.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      element.all(by.repeater('field in fields')).get(0).element(by.css('input')).sendKeys(agenciesNames[i-1]);
      element.all(by.repeater('field in fields')).get(1).element(by.css('input')).sendKeys('Super Address1_'+i);
      element.all(by.repeater('field in fields')).get(2).element(by.css('input')).sendKeys('Super Address2_'+i);
      element.all(by.repeater('field in fields')).get(3).element(by.css('input')).sendKeys('Super Address3_'+i);
      element.all(by.repeater('field in fields')).get(4).element(by.css('input')).sendKeys('Super Town');
      helper.selectSelector(element.all(by.repeater('field in fields')).get(5).element(by.css('.select2')),0);
      element.all(by.repeater('field in fields')).get(6).element(by.css('input')).sendKeys('E20 2BB');
      element.all(by.repeater('field in fields')).get(7).element(by.css('input')).sendKeys(number.substr(-5,5));
      element.all(by.repeater('field in fields')).get(8).element(by.css('input')).sendKeys(number.substr(-6,6));

      $('[ng-click="ok()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
    };

    element.all(by.repeater('row in options.data')).count().then(function(n){
      if(n<count){
        console.log('there is items for adding count='+(count-n));
        for(var i=1;i<=count-n;i++){
          addAgency(i);
        };
      }
      element.all(by.repeater('row in options.data')).count().then(function(n) {
        expect(n >= count).toBeTruthy();
      });
    })
  });
});
