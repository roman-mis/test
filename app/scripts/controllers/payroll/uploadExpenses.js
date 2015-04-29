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
        if(!expenses[i][2] && !expenses[i][0]){
          continue;
        }
      day = {};
      expense = [];
      console.log(i);
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
      claim[i].days.push(angular.copy(day));
      claim[i].source = 'import';
      claim[i].agency = '54cf9f23f383e9be63a0d666';
      claim[i].user = '54cf9e69f383e9be63a0d663';
      claim[i].startedDate = getMonday(claim[i].days[0].date);
      console.log(claim[i].days[0].date);
    }

    var nums = JSON.stringify([10,11,12,13,14]);
      var payrollProducts = HttpResource.model('candidates/payrollproduct/'+nums).query({},function(res){
        console.log('$$$$$$$$$$$$$$$$$');
        console.log(res);
        payrollProducts = res.data.objects;

        console.log(claim[1]);
        HttpResource.model('candidates/' + '54cf9e69f383e9be63a0d663' + '/expenses')
        .create(claim[1])
        .post()
        .then(function (response) {
            // $scope.isSaving = false;
            console.log(response)
            // if (!HttpResource.flushError(response)) {
            $scope.expenseData.claimReference = response.data.claimReference;
            $scope.gotoLast();
            // }
        });
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
