'use strict';


module.exports = function(db){
	var timesheetBatchService=require('../services/timesheetbatchservice')(db);

	var controller={};
		 
		controller.getAllTimesheetBatches=function (req,res){
			timesheetBatchService.getAllTimesheetBatches(req._restOptions)
		  	.then(function(result){
		  		
		  		var tbo = [];
			  	result.rows.forEach(function(t){
			  		var tb=getTimesheetBatchVm(t);
			  		tbo.push(tb);
				});

		  		var pagination=req._restOptions.pagination||{};
		    	var resp={result:true,objects:tbo, meta:{limit:pagination.limit,offset:pagination.offset,totalCount:result.count}};
		    
			    res.json(resp);
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		controller.getTimesheetBatchesWithTimesheet=function (req,res){
			timesheetBatchService.getTimesheetBatchesWithTimesheet(req._restOptions)
		  	.then(function(result){
		    	var resp={result:true,objects:result, meta:{totalCount:result.count}};
		    
			    res.json(resp);
		  	},function(err){
		  		res.sendFailureResponse(err);
		  	});
		};

		function getTimesheetBatchVm(timesheetBatch){
			return {
				_id: timesheetBatch._id,
				batchNumber: timesheetBatch.batchNumber,
				agency: timesheetBatch.agency || null,
				branch: timesheetBatch.branch || null,
			};
		}

 return controller;
};