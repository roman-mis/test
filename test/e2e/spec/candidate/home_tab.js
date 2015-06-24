var links = $$('.table-view-main-content .tabs-wrapper .nav-tabs a[href^="/candidates/"]');

describe('Candidate Home tab', function () {
  var passportNumber = helper.getDefaultNumber();
  
  var expireDate = new Date(new Date().getTime() + 1000*60*60*24*305);
  
  var typingExpireDateStr = [expireDate.getMonth()+1, expireDate.getDate(), expireDate.getFullYear()].join('/');
  
  var readingExpireDateStr = [('0'+expireDate.getDate()).slice(-2), ('0'+(expireDate.getMonth()+1)).slice(-2), expireDate.getFullYear()].join('/');
  
  it('Checking dialog data input',function(){
    helper.getByText(links, 'Home').click();
    $('[ng-click="editDetails()"]').click();
    expect($('.modal-content').isDisplayed()).toBeTruthy();

    helper.selectSelector(element(by.model('candidate.title')),0);
    element(by.model('candidate.firstName')).clear().sendKeys('FirstName');
    element(by.model('candidate.middleName')).clear().sendKeys('MiddleName');
    element(by.model('candidate.lastName')).clear().sendKeys('LastName');
    helper.selectSelector(element(by.model('candidate.gender')),0);
    
    helper.setDatepickerDate(element(by.css('#age')), '26/03/1987');

    helper.selectSelector(element(by.model('candidate.nationality')),0);
    
    element(by.model('candidate.passportNumber')).clear().sendKeys(passportNumber);
    
    
    helper.setDatepickerDate(element(by.model('candidate.passportExpiryDate')), readingExpireDateStr);
	
	element(by.model('candidate.drivingLicenceNumber')).clear().sendKeys('MORGA657054SM0IJ');
	browser.sleep(30000);
    $('[ng-click="saveCandidate()"]').click();
    helper.alertAccept();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('Checking if data saved to Db',function(){
    browser.getCurrentUrl().then(function (url) {
      browser.get(url);
    });

    var labels = element.all(by.css('span.meta'));
    expect(labels.get(0).getText()).toBe('Mr');
    expect(labels.get(1).getText()).toBe('FirstName');
    expect(labels.get(2).getText()).toBe('MiddleName');
    expect(labels.get(3).getText()).toBe('LastName');
    expect(labels.get(4).getText()).toBe('Male');
    expect(labels.get(5).getText()).toBe('26/03/1987');
    expect(labels.get(6).getText()).toBe('United Kingdom');
    expect(labels.get(7).getText()).toBe(passportNumber);
	expect(labels.get(8).getText()).toBe(readingExpireDateStr);
    expect(labels.get(9).getText()).toBe('MORGA657054SM0IJ');

  });
});
