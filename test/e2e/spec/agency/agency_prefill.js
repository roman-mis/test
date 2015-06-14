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
    var addBtn=$('[ng-click="addNewAgency()"]');
    var agenciesNames=['Sumertime agency','Woodoo agency','Kengoo Agency','Bogart Int','Slimshady Agency']
    var addAgency=function(i){
      addBtn.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      element(by.model('data.name')).sendKeys(agenciesNames[i-1]);
      element(by.model('data.address1')).sendKeys('Super Address1_'+i);
      element(by.model('data.address2')).sendKeys('Super Address2_'+i);
      element(by.model('data.address3')).sendKeys('Super Address3_'+i);
      element(by.model('data.town')).sendKeys('Super Town');
      helper.selectSelector(element(by.model('data.country')),0);
      element(by.model('data.postCode')).sendKeys('E20 2BB');
      element(by.model('data.companyRegNo')).sendKeys((number+number).slice(-8));
      element(by.model('data.companyVatNo')).sendKeys((number+number).slice(-9));

      $('[ng-click="ok()"]').click();
      helper.alertAccept();
      browser.sleep(1000);
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
