'use strict';
var controller={};
module.exports = function(dbs){
	var _ = require('lodash');
	var systemservice = require('../../services/systemservice')(dbs),
	adminExpenseRatesService = require('../../services/admin/adminExpenseRatesService')(dbs),
    dataList = require('../../data/data_list.json');


    controller.getExpenseRates= function(req, res) {
        return systemservice.getSystem()
	  	.then(function(system){
	  		var expenseRatesVm=getExpenseRatesVm(system);
		    res.json({result:true, objects:expenseRatesVm});
	  	},function(err){
	  		res.sendFailureResponse(err);
	  	});    
    };

    controller.postExpenseRates= function(req, res) {
        saveExpenseRates(req, res, 'post');
    };

    controller.patchExpenseRates= function(req, res) {
        saveExpenseRates(req, res, 'patch');
    };

    function saveExpenseRates(req, res, type) {
        var expenseRatesInfo=req.body;
    	return adminExpenseRatesService.saveExpenseRates((type==='patch'?req.params.id:null), expenseRatesInfo)
		.then(function(expenseRate){
			res.json({result:true, object:expenseRate});
		},function(err){
		 	res.sendFailureResponse(err);
		});  
    }

    function getExpenseRatesVm(system){
    	return system.expensesRate;
    }

    controller.getExpenseRatesData = function (req, res) {
        res.json(dataList.ExpensesRateTypes);
    };

    controller.getByExpenseRateType= function(req, res) {
        var exensesRateType = req.params.expensesRateType;

        return systemservice.getSystem()
	  	.then(function(system){
	  		var exensesRateTypes = [];
	  		_.forEach(system.expensesRate, function(_expensesRate){
	  			if(_expensesRate.expensesRateType.toString().toLowerCase() === exensesRateType.toLowerCase()){
	  				exensesRateTypes.push(_expensesRate);
	  			}
	  		});

	  		res.json({result:true, objects: exensesRateTypes});

	  	},function(err){
	  		res.sendFailureResponse(err);
	  	});    

    };

	return controller;
};