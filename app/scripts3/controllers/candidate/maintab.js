'use strict';
angular.module('origApp.controllers')
  .controller('CandidatetabController', function($scope) {
    this.tabCaptions = ['', 'Home', 'Contact', 'Payroll', 'Payslips', 'Agencies', 'Compliance', 'History'];
    this.isCollapsed = true;
    this.tab = 1;

    this.caption = this.tabCaptions[this.tab];

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(activeTab) {
      this.tab = activeTab;
      this.isCollapsed = true;
      this.caption = this.tabCaptions[this.tab];
    };
  })

  .controller('tabPayrFoll', function() {
    this.tabroll = 1;

    this.setTab = function(activeTab) {
      this.tab = activeTab;
      this.isCollapsed = true;
      this.caption = this.tabCaptions[this.tab];
    };
  })

  .controller('tabPayroll', function() {
    this.tabroll = 1;

    this.setTab = function(newValue) {
      this.tabroll = newValue;
    };

    this.isSet = function(tabName) {
      return this.tabroll === tabName;
    };
  });
