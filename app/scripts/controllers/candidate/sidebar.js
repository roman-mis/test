'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarController', function($scope, ModalService) {
          $scope.openDPAWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_dpa_questions.html',
              parentScope: $scope,
              controller: 'CandidateSidebarDPAController'
            });
          };

          $scope.openOnboardingWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_onboarding.html',
              parentScope: $scope,
              controller: 'CandidateSidebarOnboardingController',
              size: 'lg'
            });
          };

          /*$scope.openAddCallLogWin = function(params) {
           ModalService.open({
           templateUrl: 'views/candidate/_add_call_log.html',
           parentScope: $scope,
           params: params,
           controller: '_CandidateSidebarAddCallLogController',
           size: 'lg'
           });
           };*/

          $scope.openCreateTaskWin = function(params) {
            ModalService.open({
              templateUrl: 'views/candidate/_create_task.html',
              parentScope: $scope,
              params: params,
              controller: 'CandidateSidebarCreateTaskController',
              size: 'lg'
            });
          };

          $scope.openCreateDocumentWin = function(params) {
            ModalService.open({
              templateUrl: 'views/candidate/_create_document.html',
              parentScope: $scope,
              params: params,
              controller: 'CandidateSidebarCreateDocumentController',
              size: 'lg'
            });
          };

          $scope.openAddActivityWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_add_activity.html',
              parentScope: $scope,
              controller: 'CandidateSidebarAddActivityController'
            });
          };

          $scope.openSalaryCalculatorWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_salary_calculator.html',
              parentScope: $scope,
              controller: '_CandidateSidebarSalaryCalculatorController',
              size: 'lg'
            });
          };

          $scope.openAddExpensesWin = function() {
            ModalService.open({
              templateUrl: 'views/candidate/_add_exp.html',
              parentScope: $scope,
              controller: 'CandidateSidebarAddExpController'
            });
          };
        })

        //DPA questions
        .controller('CandidateSidebarDPAController', function($scope, $modalInstance) {
          $scope.dpaLists = [
            {question: 'Test questions 1', answer: ''},
            {question: 'Test questions 2', answer: ''},
            {question: 'Test questions 3', answer: ''}
          ];
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            $modalInstance.close();
          };
        })

		//ngTagsInput 
		.controller('CandidatengTagsInputController', function($scope) {
          $scope.tagsMonday = [
            { text: 'just' },
            { text: 'some' }
          ];
		  $scope.tagsTuesday = [
            { text: 'just' },
            { text: 'some' }
          ];
		  $scope.tagsWednesday = [
            { text: 'just' },
            { text: 'some' }
          ];
		  $scope.tagsThursday = [
            { text: 'just' },
            { text: 'some' }
          ];
		  $scope.tagsFriday = [
            { text: 'just' },
            { text: 'some' }
          ];   
		})

        //Add call-log
        /*.controller('_CandidateSidebarAddCallLogController', function($scope, $modalInstance) {
         $scope.cancel = function() {
         $modalInstance.dismiss('cancel');
         };
         $scope.ok = function() {
         $modalInstance.close();
         };
         })*/

        //Salary-calculator
        .controller('_CandidateSidebarSalaryCalculatorController', function($scope, $modalInstance) {
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          $scope.ok = function() {
            $modalInstance.close();
          };
        })

        //Add Expenses 2
        .controller('_CandidateSidebarExpenses2Controller', function($scope, $modalInstance, ModalService) {
           $scope.back = function() {
			$modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_1.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpensesController'
            });
          };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_3.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses3Controller'
            });
          };
        })

        //Add Expenses 3
        .controller('_CandidateSidebarExpenses3Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_2.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses2Controller'
            });
          };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_4.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses4Controller'
            });
          };
        })

        //Add Expenses 4 
        .controller('_CandidateSidebarExpenses4Controller', function($scope, $modalInstance, ModalService) {
          $scope.back= function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_3.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses3Controller'
            });
          };

          $scope.activeDate1 = '';
          $scope.activeDate2 = '';
          $scope.selectedDates1 = [];
          $scope.selectedDates2 = [];

          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_5.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses4DatepickerController'
            });
          };
        })

        //Add Expenses 4 datepicker
        .controller('_CandidateSidebarExpenses4DatepickerController', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_4.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses4Controller'
            });
          };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_5.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses5Controller'
            });
          };
        })
		
		//Add Expenses  5
        .controller('_CandidateSidebarExpenses5Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_5.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses4DatepickerController'
            });
          };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_6.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses6Controller'
            });
          };
        })

        //Add Expenses  6
        .controller('_CandidateSidebarExpenses6Controller', function($scope, $modalInstance, ModalService) {
           $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_5.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses5Controller'
            });
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_7.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses7Controller'
            });
          };
        })

        //Add Expenses  7
        .controller('_CandidateSidebarExpenses7Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_6.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses6Controller'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_8.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses8Controller',
              size: 'lg'
            });
          };
        })

        //Add Expenses  8
        .controller('_CandidateSidebarExpenses8Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_7.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses7Controller'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_9.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses9Controller'
            });
          };
        })

        //Add Expenses  9
        .controller('_CandidateSidebarExpenses9Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_8.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses8Controller',
              size: 'lg'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_10.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses10Controller'
            });
          };
        })

        //Add Expenses  10
        .controller('_CandidateSidebarExpenses10Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_9.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses9Controller'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_11.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses11Controller'
            });
          };
        })


        //Add Expenses  11
        .controller('_CandidateSidebarExpenses11Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_10.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses10Controller'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_12.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses12Controller',
              size: 'lg'
            });
          };
        })

        //Add Expenses  12
        .controller('_CandidateSidebarExpenses12Controller', function($scope, $modalInstance, ModalService) {
           $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_11.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses11Controller'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_13.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses13Controller',
              size: 'lg'
            });
          };
		  $scope.uploadedFile = '';
		  $scope.uploadedFile1 = '';
		  $scope.uploadedFile2 = '';
		  $scope.uploadedFile3 = '';
		  $scope.uploadedFile4 = '';
		  $scope.uploadedFile5 = '';
		  $scope.uploadedFile6 = '';
		  $scope.uploadedFile7 = '';
		  $scope.uploadedFile8 = '';
		  $scope.uploadedFile9 = '';
		  $scope.uploadedFile10 = '';
		  $scope.uploadedFile11 = '';
		  $scope.uploadedFile12 = '';
		  $scope.uploadedFile13 = '';
		  $scope.uploadedFile14 = '';
		  $scope.uploadedFile15 = '';
		  $scope.uploadedFile16 = '';
		  $scope.uploadedFile17 = '';
        })

        //Add Expenses  13
        .controller('_CandidateSidebarExpenses13Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_12.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses12Controller',
              size: 'lg'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_14.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses14Controller'
            });
          };
        })

        //Add Expenses  14
        .controller('_CandidateSidebarExpenses14Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_13.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses13Controller',
              size: 'lg'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_15.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses15Controller',
              size: 'lg'
            });
          };
        })

        //Add Expenses  15
        .controller('_CandidateSidebarExpenses15Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_14.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses14Controller'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_16.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses16Controller'
            });
          };
        })

        //Add Expenses  16
        .controller('_CandidateSidebarExpenses16Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_add_expenses_15.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses15Controller',
              size: 'lg'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_P46_information_request.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses17Controller',
              size: 'lg'
            });
          };
        })

        //Add Expenses  17 P46InformationRequest
        .controller('_CandidateSidebarExpenses17Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl:  'views/candidate/_add_expenses_16.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses16Controller'
			});
		  };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_P45_information_request.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses18Controller'
            });
          };
        })

        //Add Expenses  18 P45InformationRequest
        .controller('_CandidateSidebarExpenses18Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_P46_information_request.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses17Controller',
			  size: 'lg'
			});
          };
          $scope.ok = function() {
            $modalInstance.close();
            ModalService.open({
              templateUrl: 'views/candidate/_add_expenses_8_new_LocationInformation.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses19Controller',
			  size: 'lg'
            });
          };
        })
		
		 //Add Expenses  8 new
        .controller('_CandidateSidebarExpenses19Controller', function($scope, $modalInstance, ModalService) {
          $scope.back = function() {
            $modalInstance.close();
			ModalService.open({
			  templateUrl: 'views/candidate/_P45_information_request.html',
              parentScope: $scope,
              controller: '_CandidateSidebarExpenses18Controller'
			});
          };
          $scope.ok = function() {
            $modalInstance.close();
          };
        });

        
		
	
		

