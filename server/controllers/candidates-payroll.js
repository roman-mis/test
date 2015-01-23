'use strict';


module.exports = function(dbs){
  var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    db = dbs,
    router = express.Router(),
    candidatepayrollservice=require('../services/payrollservice'),
    candidateservice=require('../services/candidateservice'),
    utils=require('../utils/utils'),
    expressJwt = require('express-jwt'),
    restMiddleware=require('../middlewares/restmiddleware'),
    fs=require('fs'),
    path=require('path')
    ;
    var awsservice=require('../services/awsservice');

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
    }

    controller.postPayrollTax=function (req,res){

      var payrollTax={
        declaration: req.body.declaration,
        p45_gross_tax: req.body.p45_gross_tax,
        p45_tax_deducted: req.body.p45_tax_deducted,
        pay_frequency: req.body.pay_frequency,
        tax_code: req.body.tax_code,
        tax_basis: req.body.tax_basis,
        start_date: req.body.start_date,
        ni_number: req.body.ni_number
      };

      candidatepayrollservice.updatePayrollTaxDetails(req.params.candidateId, payrollTax).then(function(response){
        res.json({result:true,object:getPayrollTaxViewModel(response)});
        },function(err){
         res.sendFailureResponse(err);
      });
    }

    controller.getPayrollProduct=function (req,res){
      candidatepayrollservice.getPayrollProductDetails(req.params.candidateId)
        .then(function(user){
          if(user){
            var pp = user.worker.payroll_product.id(req.params.productId);
            console.log(pp);
            res.json({result:true, object: pp});
          }
          else{
            res.json({result:false, message:'Payroll Product Information not found'});
          }
        },res.sendFailureResponse);
    }

    controller.getPayrollProducts=function (req,res){
      candidatepayrollservice.getPayrollProductDetails(req.params.candidateId)
        .then(function(payroll_products){
          if(payroll_products){
            res.json({result:true, objects: payroll_products});
          }
          else{
            res.json({result:false, message:'Payroll Product Information not found'});
          }
        },res.sendFailureResponse);
    }

    controller.postPayrollProduct=function (req,res){
      // var payrollProduct = {
      //   _id: req.body._id,
      //   agency_id: req.body.agency_id,
      //   margin: req.body.margin,
      //   margin_fixed: req.body.margin_fixed,
      //   holiday_pay_rule: req.body.holiday_pay_rule,
      //   derogation_contract: req.body.derogation_contract,
      //   derogation_spread: req.body.derogation_spread,
      //   service_used: req.body.service_used,
      //   payment_terms: req.body.payment_terms,
      //   payment_method: req.body.payment_method,
      //   job_description: req.body.job_description
      // }

      // candidatepayrollservice.updatePayrollProductDetails(req.params.id, payrollProduct).then(function(response){
      //   res.json({result:true,object:getPayrollProductViewModel(response)});
      //   },function(err){
      //    res.sendFailureResponse(err);
      // });

      savePayrollProduct(req, res, 'post');
    }

    function savePayrollProduct(req, res, type){
      var payrollProduct = {
        agency_id: req.body.agency_id,
        branch_id: req.body.branch_id,
        consultant_id: req.body.consultant_id,
        agency_ref: req.body.agency_ref,
        margin: req.body.margin,
        margin_fixed: req.body.margin_fixed,
        holiday_pay_rule: req.body.holiday_pay_rule,
        derogation_contract: req.body.derogation_contract,
        derogation_spread: req.body.derogation_spread,
        service_used: req.body.service_used,
        payment_terms: req.body.payment_terms,
        payment_method: req.body.payment_method,
        job_description: req.body.job_description
      }
      console.log(payrollProduct);

      if(type=='patch' && (req.params.productId == undefined || req.params.productId == '')){
        res.json({result:false, message:'Product Id not found'});
      }else{
        payrollProduct['_id'] = req.params.productId;
      }

      candidatepayrollservice.updatePayrollProductDetails(req.params.candidateId, payrollProduct).then(function(response){
        // REVIEW: using new response and proper viewmodel
        // res.json({result:true,object:getPayrollProductViewModel(response.user,response.product)});
        var vm=getPayrollProductViewModel(response.user,response.product);
        res.json({result:true,object:vm});
        
        },function(err){
         res.sendFailureResponse(err);
      });
    }

    controller.patchPayrollProduct=function (req,res){
      console.log('here');
      savePayrollProduct(req, res, 'patch');

      // var payrollProduct = {
      //   _id: req.body._id,
      //   agency_id: req.body.agency_id,
      //   margin: req.body.margin,
      //   margin_fixed: req.body.margin_fixed,
      //   holiday_pay_rule: req.body.holiday_pay_rule,
      //   derogation_contract: req.body.derogation_contract,
      //   derogation_spread: req.body.derogation_spread,
      //   service_used: req.body.service_used,
      //   payment_terms: req.body.payment_terms,
      //   payment_method: req.body.payment_method,
      //   job_description: req.body.job_description
      // }

      // if(req.body._id == undefined || req.body._id == ''){
      //   res.json({result:false, message:'_id not found'});
      // }else{
      //   candidatepayrollservice.updatePayrollProductDetails(req.params.id, payrollProduct).then(function(response){
      //     res.json({result:true,object:getPayrollProductViewModel(response)});
      //     },function(err){
      //      res.sendFailureResponse(err);
      //   });
      // }
    }

    controller.deletePayrollProduct=function (req,res){
      candidatepayrollservice.deletePayrollProductDetails(req.params.candidateId, req.params.productId)
      .then(function(response){
        // REVIEW: using new response and proper viewmodel
        // res.json({result:true,object:getPayrollProductViewModel(response.user,response.product)});
        // var vm=getPayrollProductViewModel(response.user,response.product);
        res.json({result:true});
        },function(err){
         res.sendFailureResponse(err);
      });
    }

    function getPayrollTaxViewModel(user){
      var worker = user.worker;
      if(worker.payroll_tax == null)
        return {};
      else{
          return {
            '_id':user._id, 
            declaration: worker.payroll_tax.declaration, 
            p45_gross_tax: worker.payroll_tax.p45_gross_tax,
            p45_tax_deducted: worker.payroll_tax.p45_tax_deducted,
            pay_frequency: worker.payroll_tax.pay_frequency,
            tax_basis: worker.payroll_tax.tax_basis,
            tax_code: worker.payroll_tax.tax_code,
            start_date: worker.start_date,
            ni_number: worker.tax_detail.ni_number
          };
      }
    }

    function getPayrollProductViewModel(user,product){
      var worker = user.worker;
      return product;//{'_id':product.id, payroll_product: worker.payroll_product};
    }

    controller.getMarginException=function (req,res){
      candidateservice.getUser(req.params.candidateId)
        .then(function(user){
          if(user){
            res.json({result:true, objects: user.worker.payroll_product.id(req.params.productId).margin_exception});
          }
          else{
            res.json({result:false, message:'Payroll Product Information not found'});
          }
        },res.sendFailureResponse);
    }

    controller.postMarginException=function (req,res){
      var marginExceptionDetails = {
        margin_type: req.body.margin_type,
        reason:  req.body.reason,
        deduction_type:  req.body.deduction_type,
        deduction_date:  req.body.deduction_date,
        deduction_period:  req.body.deduction_period,
        deduction_number_of_payroll:  req.body.deduction_number_of_payroll,
        created_by:  req.user.id,
        created_date: new Date()
      };

      candidatepayrollservice.postMarginException(req.params.candidateId, req.params.productId, marginExceptionDetails).then(function(response){
        res.json({result:true, object:response.object});
      },function(err){
         res.sendFailureResponse(err);
      });
    }

    controller.patchMarginException=function (req,res){
      var marginExceptionDetails = {
        margin_type: req.body.margin_type,
        reason:  req.body.reason,
        deduction_type:  req.body.deduction_type,
        deduction_date:  req.body.deduction_date,
        deduction_period:  req.body.deduction_period,
        deduction_number_of_payroll:  req.body.deduction_number_of_payroll,
        // created_by:  req.user.id,
        // created_date: new Date()
      };

      candidatepayrollservice.patchMarginException(req.params.candidateId, req.params.productId, req.params.marginExceptionId, marginExceptionDetails).then(function(response){
        res.json({result:true, object:response.object});
      },function(err){
         res.sendFailureResponse(err);
      });
    }

    controller.deleteMarginException=function (req,res){
      candidatepayrollservice.deleteMarginException(req.params.candidateId, req.params.productId, req.params.marginExceptionId)
      .then(function(response){
        res.json({result:true});
      },function(err){
        res.sendFailureResponse(err);
      });
    }

  return controller;
};