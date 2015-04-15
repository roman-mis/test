'use strict';

angular.module('origApp.controllers')
  .controller('candidateMarginController', function ($scope, HttpResource) {
  
console.log($scope.candidateId);
HttpResource.model('users/'+$scope.candidateId+'/marginFee').query({},function (res) {
          $scope.marginFee = res.data.object;
          console.log(res);
        });
    
      $scope.marginOptions = [
        'Use Candidate', 'Use Agency'
      ];
    // If revertChanges is set to true, then it reverts changes from cache. Otherwise updates cache.
    // var updateObject = function (object, revertChanges) {
    //    var service = object._service,
    //      cache = service.cache,
    //      i;
        
    //    for (i in cache) {
    //      if (cache.hasOwnProperty(i) === true) {
    //        revertChanges === true ? object[i] = cache[i] : cache[i] = object[i];
    //      }
    //    }
    //    service.isEdited = false;
    //  },
    //  getObjectByName = function (name) {
    //    var obj;
        
    //    switch (name) {
    //      case 'timesheet':
    //        obj = $scope.timesheets;
    //        break;
    //      case 'totalHours':
    //        obj = $scope.totalHours;
    //        break;
    //      default: 
    //        throw new Error('Unknown object name');
    //    }

    //    return obj;
    //  };
  
    

    
    // $scope.timesheets = [
    //  {
    //    from: 0,
    //    to: 100.99,
    //    percentage: 8,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 0,
    //        to: 100.99,
    //        percentage: 8
    //      }
    //    }
    //  }, 
    //  {
    //    from: 101,
    //    to: 250.99,
    //    percentage: 5,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 101,
    //        to: 250.99,
    //        percentage: 4
    //      }
    //    }
    //  }, 
    //  {
    //    from: 251,
    //    to: 500.00,
    //    percentage: 4,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 251,
    //        to: 500.00,
    //        percentage: 4
    //      }
    //    }
    //  }
    // ];
    $scope.Number = Number;
    $scope.save = function () {
    
      HttpResource.model('users/marginFee').create($scope.marginFee).patch($scope.candidateId).then(function (res) {
          console.log('patching',res);
        });
    };
    $scope.editTimesheets = function (index) {
      $scope.backupTimesheets=angular.copy($scope.marginFee.margin.percentageOfTimesheets.ranges);
      for (var i = 0; i < $scope.marginFee.margin.percentageOfTimesheets.ranges.length; i++) {
        if(i === index){
        $scope.marginFee.margin.percentageOfTimesheets.ranges[i].isEdited = true;
        }else{
        $scope.marginFee.margin.percentageOfTimesheets.ranges[i].isEdited = false;
        }
      }
    };
    $scope.editHours = function (index) {
      $scope.backupHours=angular.copy($scope.marginFee.margin.totalHours.ranges);
      for (var i = 0; i < $scope.marginFee.margin.totalHours.ranges.length; i++) {
        if(i === index){
        $scope.marginFee.margin.totalHours.ranges[i].isEdited = true;
        }else{
        $scope.marginFee.margin.totalHours.ranges[i].isEdited = false;
        }
      }
    };
    $scope.revertTimesheet = function (index) {
      
        $scope.marginFee.margin.percentageOfTimesheets.ranges[index] = angular.copy($scope.backupTimesheets[index]);
      $scope.marginFee.margin.percentageOfTimesheets.ranges[index].isEdited = false;
      
    };

    $scope.revertHour = function (index) {
      $scope.marginFee.margin.totalHours.ranges[index] = angular.copy($scope.backupHours[index]);
      $scope.marginFee.margin.totalHours.ranges[index].isEdited = false;
    };

    $scope.timesheetsAddRow = function () {
      $scope.marginFee.margin.percentageOfTimesheets.ranges.push({from:'',to:'',charged:'',isEdited:true});
      $scope.backupTimesheets = angular.copy($scope.marginFee.margin.percentageOfTimesheets.ranges);
    };
    $scope.hoursAddRow = function () {
      $scope.marginFee.margin.totalHours.ranges.push({from:'',to:'',charged:'',isEdited:true});
      $scope.backupHours = angular.copy($scope.marginFee.margin.totalHours.ranges);
    };
    $scope.timesheetsDeleteRow = function (index) {
      $scope.marginFee.margin.percentageOfTimesheets.ranges.splice(index,1);
      $scope.save();
    };

    $scope.hoursDeleteRow = function (index) {
      $scope.marginFee.margin.totalHours.ranges.splice(index,1);
      $scope.save();
    };
    // $scope.save = function (index, objName) {
    //  updateObject(getObjectByName(objName)[index]);
    // };
    
    // $scope.revertChanges = function (index, objName) {
    //  updateObject(getObjectByName(objName)[index], true);
    // };
        
    // $scope.removeRow = function (index, objName) {
    //  Array.prototype.splice.call(getObjectByName(objName), index, 1);
    // };
    
    // $scope.addRow = function (objName) {
    //  Array.prototype.push.call(getObjectByName(objName), {
    //    from: '',
    //    to: '',
    //    percentage: '',
    //    _service: {
    //      isEdited: true,
    //      cache: {
    //        from: '',
    //        to: '',
    //        percentage: ''
    //      }
    //    }
    //  });
    // };
    
    // $scope.totalHours = [
    //  {
    //    from: 0,
    //    to: 3,
    //    amount: 3,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 0,
    //        to: 3,
    //        amount: 3
    //      }
    //    } 
    //  },
    //  {
    //    from: 4,
    //    to: 6,
    //    amount: 6,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 4,
    //        to: 6,
    //        amount: 6
    //      }
    //    }
    //  },
    //  {
    //    from: 7,
    //    to: 9,
    //    amount: 9,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 7,
    //        to: 9,
    //        amount: 9
    //      }
    //    } 
    //  },
    //  {
    //    from: 10,
    //    to: 12,
    //    amount: 12,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 10,
    //        to: 12,
    //        amount: 12
    //      }
    //    }
    //  },
    //  {
    //    from: 13,
    //    to: 15,
    //    amount: 15,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 13,
    //        to: 15,
    //        amount: 15
    //      }
    //    } 
    //  },
    //  {
    //    from: 16,
    //    to: 18,
    //    amount: 18,
    //    _service: {
    //      isEdited: false,
    //      cache: {
    //        from: 16,
    //        to: 18,
    //        amount: 18
    //      }
    //    }
    //  }
    // ];
    
  });