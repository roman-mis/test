var links = $$('.table-view-main-content .tabs-wrapper .nav-tabs a[href^="/candidates/"]');
var tabs = element.all(by.css('.tabs-payroll li[role="presentation"]'));
var activeTab = element(by.css('.tabs-wrapper li.active[role="presentation"]'));

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
  
  it('should save margin rule', function(){
	  helper.selectSelector(element(by.model('marginFee.margin.marginType')), 0);
	  helper.selectSelector(element(by.model('marginFee.margin.marginType')), 1);
	  
	  browser.refresh();
	  
	  expect(element(by.model('marginFee.margin.marginType')).getText()).toBe('agency');
  });

  it('navigating inner tabs', function () {	
	//! 'Fixed fee'
	element(by.css('a[data-target="#fixedFee"]')).click();
	expect(activeTab.getText()).toBe('Fixed Fee');
	//! '% of timesheets'
	element(by.css('a[data-target="#percentOfTimesheets"]')).click();
	expect(activeTab.getText()).toBe('% of Timesheets');
	//! 'Total hours'
	element(by.css('a[data-target="#totalHours"]')).click();
	expect(activeTab.getText()).toBe('Total Hours');
	//! 'Fixed on timesheets'
	element(by.css('a[data-target="#fixedOnTimesheets"]')).click();
	expect(activeTab.getText()).toBe('Fixed on Timesheets');

  });
  
  it('should save fixed fee amount', function(){
	var value = helper.getDefaultNumber().substr(4);
	  
	//! 'Fixed fee'
	element(by.css('a[data-target="#fixedFee"]')).click();
	expect(activeTab.getText()).toBe('Fixed Fee');
	
	element(by.model('marginFee.margin.fixedFee')).clear().sendKeys(value);
	
	element(by.css('#fixedFee [ng-click="save()"]')).click();
	
	browser.refresh();
	
	//! 'Fixed fee'
	element(by.css('a[data-target="#fixedFee"]')).click();
	expect(activeTab.getText()).toBe('Fixed Fee');
	
	expect(element(by.model('marginFee.margin.fixedFee')).getAttribute('value')).toBe(value+'');
  });  
  
  it('edit "% of timesheets"', function(){
	  var minValue = Math.floor(Math.random()*50);
	  var maxValue = minValue+Math.floor(Math.random()*50);
	  
	  var timesheetFrom = 10;
	  var timesheetTo = 20;
	  var timesheetCharged = 10;
	  
	  var maxAmountModel = element(by.model('marginFee.margin.percentageOfTimesheets.maxAmount'));
	  var minAmountModel = element(by.model('marginFee.margin.percentageOfTimesheets.minAmount'));
	  
	  var rows = element.all(by.repeater('timesheet in marginFee.margin.percentageOfTimesheets.ranges'));
	  //! 'navigating'
	  //! '% of timesheets'
	  element(by.css('a[data-target="#percentOfTimesheets"]')).click();
	  expect(activeTab.getText()).toBe('% of Timesheets');
	  //! 'removing'
	  element.all(by.css('[ng-click="timesheetsDeleteRow($index)"]')).each(function(btn){
		  btn.click();
	  });
	  //! 'typing min-max'
	  maxAmountModel.clear().sendKeys(maxValue.toString());
	  minAmountModel.clear().sendKeys(minValue.toString());
	  //! 'saving'
	  element(by.css('#percentOfTimesheets [ng-click="save()"]')).click();
	  
	  browser.refresh();
	  //! 'navigating'
	  //! '% of timesheets'
	  element(by.css('a[data-target="#percentOfTimesheets"]')).click();
	  expect(activeTab.getText()).toBe('% of Timesheets');
	  //! 'checking min-max'
	  expect(maxAmountModel.getAttribute('value')).toBe(maxValue.toString());
	  expect(minAmountModel.getAttribute('value')).toBe(minValue.toString());
	  //! 'adding row'
	  element(by.css('[ng-click="timesheetsAddRow()"]')).click();
	  //! 'editing'
	  element(by.model('timesheet.from')).clear().sendKeys(timesheetFrom.toString());
	  element(by.model('timesheet.to')).clear().sendKeys(timesheetTo.toString());
	  element(by.model('timesheet.charged')).clear().sendKeys(timesheetCharged.toString());	  
	  //! 'saving'
	  element(by.css('[ng-click="save();timesheet.isEdited = !timesheet.isEdited"]')).click();
	  
	  browser.refresh();
	  //! 'navigating'
	  //! '% of timesheets'
	  element(by.css('a[data-target="#percentOfTimesheets"]')).click();
	  expect(activeTab.getText()).toBe('% of Timesheets');
	  //! 'checking'
	  expect(rows.first().all(by.css('td')).get(0).getText()).toBe(timesheetFrom.toString());
	  expect(rows.first().all(by.css('td')).get(1).getText()).toBe(timesheetTo.toString());
	  expect(rows.first().all(by.css('td')).get(2).getText()).toBe(timesheetCharged+'%');
	  
	  element(by.css('[ng-click="timesheetsDeleteRow($index)"]')).click();
	  
	  expect(rows.count()).toBe(0);
  });
  it('edit "Total Hours"', function(){
	  var minValue = Math.floor(Math.random()*50);
	  var maxValue = minValue+Math.floor(Math.random()*50);
	  
	  var totalHoursFrom = 10;
	  var totalHoursTo = 20;
	  var totalHoursCharged = 10;	  
	  
	  var maxAmountModel = element(by.model('marginFee.margin.totalHours.maxAmount'));
	  var minAmountModel = element(by.model('marginFee.margin.totalHours.minAmount'));
	  
	  var rows = element.all(by.repeater('totalHour in marginFee.margin.totalHours.ranges'));
	  
	  //! 'Total hours'
	  element(by.css('a[data-target="#totalHours"]')).click();
	  expect(activeTab.getText()).toBe('Total Hours');
	  
	  element.all(by.css('[ng-click="hoursDeleteRow($index)"]')).each(function(btn){
		  btn.click();
	  });
	  
	  maxAmountModel.clear().sendKeys(maxValue);
	  minAmountModel.clear().sendKeys(minValue);
	  
	  element(by.css('#totalHours [ng-click="save()"]')).click();
	  
	  browser.refresh();
	  
	  //! 'Total hours'
	  element(by.css('a[data-target="#totalHours"]')).click();
	  expect(activeTab.getText()).toBe('Total Hours');
	  
	  expect(maxAmountModel.getAttribute('value')).toBe(maxValue+'');
	  expect(minAmountModel.getAttribute('value')).toBe(minValue+'');
	  
	  element(by.css('[ng-click="hoursAddRow()"]')).click();
	  
	  element(by.model('totalHour.from')).clear().sendKeys(totalHoursFrom+'');
	  element(by.model('totalHour.to')).clear().sendKeys(totalHoursTo+'');
	  element(by.model('totalHour.charged')).clear().sendKeys(totalHoursCharged+'');
	  
	  element(by.css('[ng-click="save();totalHour.isEdited = !totalHour.isEdited"]')).click();
	  
	  browser.refresh();
	  
	  //! 'Total hours'
	  element(by.css('a[data-target="#totalHours"]')).click();
	  expect(activeTab.getText()).toBe('Total Hours');
	  
	  expect(rows.first().all(by.css('td')).get(0).getText()).toBe(totalHoursFrom+'');
	  expect(rows.first().all(by.css('td')).get(1).getText()).toBe(totalHoursTo+'');
	  expect(rows.first().all(by.css('td')).get(2).getText()).toBe('£'+totalHoursCharged+'');
	  
	  element(by.css('[ng-click="hoursDeleteRow($index)"]')).click();
	  
	  expect(rows.count()).toBe(0);
  });
  
  it('should save fixed on timesheets amount', function(){
	var value = helper.getDefaultNumber().substr(4);
	  
	//! 'Fixed on timesheets'
	element(by.css('a[data-target="#fixedOnTimesheets"]')).click();
	expect(activeTab.getText()).toBe('Fixed on Timesheets');
	
	element(by.model('marginFee.margin.fixedOnTimesheets')).clear().sendKeys(value);
	
	element(by.css('#fixedOnTimesheets [ng-click="save()"]')).click();
	
	browser.refresh();
	
	//! 'Fixed on timesheets'
	element(by.css('a[data-target="#fixedOnTimesheets"]')).click();
	expect(activeTab.getText()).toBe('Fixed on Timesheets');
	
	expect(element(by.model('marginFee.margin.fixedOnTimesheets')).getAttribute('value')).toBe(value+'');
  });  
});
