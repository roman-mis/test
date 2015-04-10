//var helper = require('../ui-helper.js');
var links = $$('.candidate-tabs li a');

describe('Candidate Home tab', function () {
  it('Checking dialog data input',function(){
    links.get(0).click();
    $('[ng-click="editDetails()"]').click();

    expect($('.modal-content').isDisplayed()).toBeTruthy();
  });

});
