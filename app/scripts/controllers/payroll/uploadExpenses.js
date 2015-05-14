'use strict';
var app = angular.module('origApp.controllers');
app.controller('uploadExpensesCtrl',['$scope', 'HttpResource', '$modal', 'expenses', '$modalInstance', '$rootScope',
	function($scope, HttpResource, $modal, expenses, $modalInstance, $rootScope){
		// console.log($scope.expenses);
		console.log(expenses);
		var expenseElement = {};

    function getId(value){
      var id =  '';
      $scope.allTypes = $scope.types.concat($scope.mealTypes);
      for (var i = 0; i < $scope.allTypes.length; i++) {
        
        if( $scope.allTypes[i].name === value){
          id = $scope.allTypes[i]._id;
        }
      }
      return id;
    }

    $scope.getName = function(id){
      var name =  '';
      $scope.allTypes = $scope.types.concat($scope.mealTypes);
      for (var i = 0; i < $scope.allTypes.length; i++) {
        
        if( $scope.allTypes[i]._id === id){
          name = $scope.allTypes[i].name;
        }
      }
      return name;
    };


      
 
    // get items ...
    // $scope.days    = [];
    var day     = {};
    var dateArr = {};
    var expense = [];
    var expenseTypes = ['Subsistence', 'Subsistence', 'Subsistence', 'Other', 'Other', 'Other'];
    var subTypes = ['Breakfast', 'One Meal Rate', 'Two Meal Rate', 'Training Courses', 'Stationery', 'Other'];
    console.log(expenses);
      $scope.selectedClaim = [];
      $scope.claim = [];
      var tempClaim = {};
      var userNums = [];
      var agencyNums = [];
      $scope.found = [];
      $scope.uploaded = [];
      $scope.name = [];
      var ids = [];
    function createDays(){
      for (var i = 1; i < expenses.length; i++){

        tempClaim = {days: []};
        if(!expenses[i][2] && !expenses[i][0]){
          continue;
        }
      day = {};
      expense = [];
      console.log(i);
      console.log(expenses[i]);
      $scope.uploaded.push(false);
      agencyNums.push(Number(expenses[i][0]));
      userNums.push(Number(expenses[i][1]));
      dateArr = expenses[i][2].split('/');
      console.log(dateArr);

      day.date = new Date(dateArr[2], dateArr[1]-1, dateArr[0]);
      for(var j = 3; j < 9; j++){
        expense.push({
          expenseType: expenseTypes[j-3],
          subType: getId(subTypes[j-3]),
          amount: 1,
          value: isNaN(Number(expenses[i][j]))? 0 : Number(expenses[i][j]),
        });
      }
      day.expenses = angular.copy(expense);
      tempClaim.days.push(angular.copy(day));
      tempClaim.source = 'import';
      // tempClaim.agency = '54cf9f23f383e9be63a0d666';
      tempClaim.user = $rootScope.currentUser._id;
      tempClaim.startedDate = getMonday(tempClaim.days[0].date);      
      $scope.claim.push(tempClaim);
    }
    console.log($scope.claim);
        // var index = i;
        userNums = JSON.stringify(userNums);
        HttpResource.model('candidates/payrollproduct/'+userNums).query({},function(res){
          console.log('$$$$$$$$$$$$$$$$$');
          console.log(res);
          console.log($rootScope.currentUser);
          
          for (var i = 0; i < res.data.objects.length; i++) {
            console.log('ids',res.data.objects[i]);
            ids.push(res.data.objects[i].user.id);
            $scope.name.push(res.data.objects[i].user.firstName + '' + res.data.objects[i].user.lastName);
            $scope.found[i] = false;
            for(var j = 0; j < res.data.objects[i].payrollProduct.length; j++){
              console.log(res.data.objects[i].payrollProduct[j].agency.agencyNo);
              console.log(agencyNums[i]);
              if(res.data.objects[i].payrollProduct[j].agency.agencyNo === agencyNums[i]){
                $scope.found[i] = true;
                $scope.claim[i].agency = res.data.objects[i].payrollProduct[j].agency._id;
                $scope.claim[i].agencyName = res.data.objects[i].payrollProduct[j].agency.name;
                break;
              }
            }
          }
          console.log('ids',ids);
          console.log('found',$scope.found);
          
        });
  }

  function getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
  }

  var first = false;
  var second = false;
  HttpResource.model('systems/expensesrates/expensesratetype/subsistence').query({},function(data){
    $scope.mealTypes = data.data.objects;
    console.log($scope.mealTypes);
    first = true;
    if(second === true){
      createDays();
    }
  });

  HttpResource.model('systems/expensesrates/expensesratetype/other').query({},function(data){
    $scope.types = data.data.objects;
    console.log($scope.types);
    second = true;
    if(first === true){
      createDays();
    }
  });

  $scope.selectAll = function(selected){
    for (var i = 0; i < $scope.found.length; i++) {
      if($scope.found[i] === true && $scope.uploaded[i] === false){
        $scope.selectedClaim[i] = selected;
      }
    }
  };

  $scope.uploadSelected = function(){
    console.log('*******-**************');
    var uploadedClaims=  [];
    var uploadedIds=  [];
    for (var i = 0; i < $scope.claim.length; i++) {
      if($scope.found[i] === true && $scope.uploaded[i] === false && $scope.selectedClaim[i] === true){
        uploadedClaims.push($scope.claim[i]);
        uploadedIds.push(ids[i]);
        $scope.uploaded[i] = true;
        $scope.selectedClaim[i] = false;
      }
    }
    HttpResource.model('candidates/many/manyexpenses').create({expense:uploadedClaims,ids:ids}).post().then(function (response) {
      console.log('*********************');
      console.log(response);
    });
  };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };


	}]);
