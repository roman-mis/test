describe('Trying to logout user', function() {
  it('clicking logout link',function(){
    element(by.css('.sitemenu')).isPresent().then(function(bool){
      if(bool==true){
        element(by.css('.sitemenu')).click().then(function(){
          element(by.css('.sitemenu [ng-click="logout()"]')).click();
        });
      }
    });
  });

  it('waiting untill logout',function(){
    browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return (url.indexOf('register/home') !== -1);
      });
    }, 7000);
  });
})
