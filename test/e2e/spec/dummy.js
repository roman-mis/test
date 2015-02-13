
describe('Checking mailbox', function() {

  it('should enter lite version', function () {


    var tries=0;

    browser.driver.get('https://www.ukr.net/terms/');
    var time=new Date();
    browser.driver.wait(function(){
              return browser.driver.getCurrentUrl().then(function (url) {
                console.log(url);
                if(new Date() - time>2000){
                  time=new Date();
                  browser.driver.get('https://www.ukr.net/');
                  console.log('reload');
                }
                return (url.indexOf('asd') !== -1);
              });
            }, 6000)

  });



});

