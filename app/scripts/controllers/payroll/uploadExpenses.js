'use strict';
var app = angular.module('origApp.controllers');
app.controller('uploadExpensesCtrl',['$scope', 'HttpResource', '$modal', 'expenses', '$modalInstance',
	function($scope, HttpResource, $modal, expenses, $modalInstance){
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
    var expenseTypes = ['subsistence', 'subsistence', 'subsistence', 'Other', 'Other', 'Other'];
    var subTypes = ['Breakfast', 'One Meal Rate', 'Two Meal Rate', 'Training Courses', 'Stationery', 'Other'];
    console.log(expenses);

    var claim = [];
    function createDays(){
      for (var i = 1; i < expenses.length; i++){
        claim[i] = {days: []};
        if(!expenses[i][3] && !expenses[i][0]){
          continue;
        }
      day = {};
      expense = [];
      console.log(i);
      dateArr = expenses[i][3].split('/');
      console.log(dateArr);
      day.date = new Date(dateArr[2], dateArr[1]-1, dateArr[0]);
      for(var j = 4; j < 10; j++){
        expense.push({
          expenseType: expenseTypes[j-4],
          subType: getId(subTypes[j-4]),
          amount: 1,
          value: isNaN(Number(expenses[i][j]))? 0 : Number(expenses[i][j]),
          vat:0,
          total: 0,
        });
      }
      day.expenses = angular.copy(expense);
      claim[i].days.push(angular.copy(day));  
      claim[i].source = 'import';
    }


    var nums = JSON.stringify([1,2,3]);
      var payrollProducts = HttpResource.model('candidates/payrollproduct/'+nums).query({},function(res){
        console.log(res);
        // $scope.agencies = [];
        // angular.forEach(payrollProducts, function(pp) {
        //   if($scope.agencies.indexOf(pp.agency)===-1) {
        //     $scope.agencies.push(pp.agency); 
        //   }
        // });
      });
  }


  var first = false;
  var second = false;
  HttpResource.model('systems/expensesrates/expensesratetype/subsistence').query({},function(data){
    $scope.mealTypes = data.data.objects;
    console.log($scope.mealTypes);
    first = true;
    if(second === true){
      createDays();
      console.log(claim);
    }
  });

  HttpResource.model('systems/expensesrates/expensesratetype/other').query({},function(data){
    $scope.types = data.data.objects;
    console.log($scope.types);
    second = true;
    if(first === true){
      createDays();
      console.log(claim);
    }
  });

  $scope.ok = function(){
    $modalInstance.dismiss();
  };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };


	}]);
