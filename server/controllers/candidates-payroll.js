'use strict';

var Q=require('q'),
_=require('lodash');

module.exports = function(){
  var candidatepayrollservice=require('../services/payrollservice'),
    candidateservice=require('../services/candidateservice');
    var controller={};



    controller.getPayrollTax=function (req,res){
      candidateservice.getUser(req.params.candidateId)
        .then(function(user){
          console.log(user);
          if(user){
            var vm = getPayrollTaxViewModel(user);
            res.json({result:true, object:vm});
          }
          else{
            res.json({result:false,message:'Payroll Tax Information not found'});
          }
        },res.sendFailureResponse);
    };

    controller.postPayrollTax=function (req,res){

      var payrollTax={
        declaration: req.body.declaration,
        p45GrossTax: req.body.p45GrossTax,
        p45TaxDeducted: req.body.p45TaxDeducted,
        payFrequency: req.body.payFrequency,
        taxCode: req.body.taxCode,
        taxBasis: req.body.taxBasis,
        startDate: req.body.startDate,
        niNumber: req.body.niNumber
      };

      candidatepayrollservice.updatePayrollTaxDetails(req.params.candidateId, payrollTax).then(function(response){
        res.json({result:true,object:getPayrollTaxViewModel(response)});
        },function(err){
         res.sendFailureResponse(err);
      });
    };

    // controller.getPayrollProduct=function (req,res){
    //   candidatepayrollservice.getPayrollProductDetails(req.params.candidateId)
    //     .then(function(payrollProducts){
    //       if(payrollProducts){
    //         _.forEach(payrollProducts, function(payrollProduct, key){
    //           console.log(payrollProduct);
    //           if(payrollProduct['_id'] == req.params.productId){
    //             res.json({result:true, object: payrollProduct});
    //             return false;
    //           }
    //         });
    //       }
    //       else{
    //         res.json({result:false, message:'Payroll Product Information not found'});
    //       }
    //     },res.sendFailureResponse);
    // }

    controller.getPayrollProduct=function (req,res){
      getPayrollProduct(req.params.candidateId, req.params.productId)
      .then(function(payrollProduct){
        res.json(payrollProduct);
      });
    };

    function getPayrollProduct(candidateId, productId){
      var deff=Q.defer();
      candidatepayrollservice.getPayrollProductDetails(candidateId)
        .then(function(payrollProducts){
          if(payrollProducts){
            _.forEach(payrollProducts, function(payrollProduct){
              // console.log(payrollProduct);
              if(payrollProduct._id === productId){
                deff.resolve({result:true, object: payrollProduct});
                return false;
              }
            });
          }
          else{
            deff.reject({result:false, message:'Payroll Product Information not found'});
          }
        },deff.reject);
        return deff.promise;
    }

    controller.getPayrollProducts=function (req,res){
      candidatepayrollservice.getPayrollProductDetails(req.params.candidateId)
        .then(function(payrollProducts){
          if(payrollProducts){
            res.json({result:true, objects: payrollProducts});
          }
          else{
            res.json({result:false, message:'Payroll Product Information not found'});
          }
        },res.sendFailureResponse);
    };

    controller.postPayrollProduct=function (req,res){
      savePayrollProduct(req, res, 'post');
    };

    controller.patchPayrollProduct=function (req,res){
      savePayrollProduct(req, res, 'patch');
    };

    function savePayrollProduct(req, res, type){
      var payrollProduct = {
        agency: req.body.agency,
        branch: req.body.branch,
        consultant: req.body.consultant,
        agencyRef: req.body.agencyRef,
        margin: req.body.margin,
        marginFixed: req.body.marginFixed,
        holidayPayRule: req.body.holidayPayRule,
        derogationContract: req.body.derogationContract,
        derogationSpread: req.body.derogationSpread,
        serviceUsed: req.body.serviceUsed,
        paymentTerms: req.body.paymentTerms,
        paymentMethod: req.body.paymentMethod,
        jobDescription: req.body.jobDescription
      };
      console.log(payrollProduct);

      if(type==='patch' && (req.params.productId === undefined || req.params.productId === '')){
        res.json({result:false, message:'Product Id not found'});
      }else{
        payrollProduct._id = req.params.productId;
      }

      candidatepayrollservice.updatePayrollProductDetails(req.params.candidateId, payrollProduct).then(function(response){
        // REVIEW: using new response and proper viewmodel
        // res.json({result:true,object:getPayrollProductViewModel(response.user,response.product)});
        // var vm=getPayrollProductViewModel(response.user,response.product);
        // res.json({result:true,object:vm});

        getPayrollProduct(response.user.id, response.product.id)
        .then(function(payrollProduct){
          res.json(payrollProduct);
        });

        
        },function(err){
         res.sendFailureResponse(err);
      });
    }

    controller.deletePayrollProduct=function (req,res){
      candidatepayrollservice.deletePayrollProductDetails(req.params.candidateId, req.params.productId)
      .then(function(){
        // REVIEW: using new response and proper viewmodel
        // res.json({result:true,object:getPayrollProductViewModel(response.user,response.product)});
        // var vm=getPayrollProductViewModel(response.user,response.product);
        res.json({result:true});
        },function(err){
         res.sendFailureResponse(err);
      });
    };

    function getPayrollTaxViewModel(user){
      var worker = user.worker;
      if(worker.payrollTax === null){
        return {};
      }
      else{
          return {
            '_id':user._id, 
            declaration: worker.payrollTax.declaration, 
            p45GrossTax: worker.payrollTax.p45GrossTax,
            p45TaxDeducted: worker.payrollTax.p45TaxDeducted,
            payFrequency: worker.payrollTax.payFrequency,
            taxBasis: worker.payrollTax.taxBasis,
            taxCode: worker.payrollTax.taxCode,
            startDate: worker.startDate,
            niNumber: worker.taxDetail.niNumber
          };
      }
    }

    controller.getMarginException=function (req,res){
      candidateservice.getUser(req.params.candidateId)
        .then(function(user){
          if(user){
            res.json({result:true, objects: user.worker.payrollProduct.id(req.params.productId).marginException});
          }
          else{
            res.json({result:false, message:'Payroll Product Information not found'});
          }
        },res.sendFailureResponse);
    };

    controller.postMarginException=function (req,res){
      var marginExceptionDetails = {
        marginType: req.body.marginType,
        reason:  req.body.reason,
        deductionType:  req.body.deductionType,
        deductionDate:  req.body.deductionDate,
        deductionPeriod:  req.body.deductionPeriod,
        deductionNumberOfPayroll:  req.body.deductionNumberOfPayroll,
        createdBy:  req.user.id,
        createdDate: new Date()
      };

      candidatepayrollservice.postMarginException(req.params.candidateId, req.params.productId, marginExceptionDetails).then(function(response){
        res.json({result:true, object:response.object});
      },function(err){
         res.sendFailureResponse(err);
      });
    };

    controller.patchMarginException=function (req,res){
      var marginExceptionDetails = {
        marginType: req.body.marginType,
        reason:  req.body.reason,
        deductionType:  req.body.deductionType,
        deductionDate:  req.body.deductionDate,
        deductionPeriod:  req.body.deductionPeriod,
        deductionNumberOfPayroll:  req.body.deductionNumberOfPayroll,
        // createdBy:  req.user.id,
        // createdDate: new Date()
      };

      candidatepayrollservice.patchMarginException(req.params.candidateId, req.params.productId, req.params.marginExceptionId, marginExceptionDetails).then(function(response){
        res.json({result:true, object:response.object});
      },function(err){
         res.sendFailureResponse(err);
      });
    };

    controller.deleteMarginException=function (req,res){
      candidatepayrollservice.deleteMarginException(req.params.candidateId, req.params.productId, req.params.marginExceptionId)
      .then(function(){
        res.json({result:true});
      },function(err){
        res.sendFailureResponse(err);
      });
    };

  return controller;
};