var links = $$('.candidate-tabs li a');

describe('Navigating to Margin tab', function () {


  it('getting inside tab', function () {
    links.get(3).click();

    //wait until url change
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('margin') !== -1);
      });
    });
  });

  it('navigating inner tabs', function () {

    //cycle for 1-4
    //check overall count =4
    //check if  class=active on click
    //check labels

  });
});
