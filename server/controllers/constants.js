'use strict';

module.exports = function(dbs){
  
    var express = require('express'),
        jwt = require('jsonwebtoken'),
        db = dbs,
        aws = require('aws-sdk'),
        mailer=require('../mailing/mailer'),
        path=require('path'),
        data_list=require('../data/data_list.json'),
        awsService=require('../services/awsservice');
    var bcrypt=require('bcryptjs');
    var utils=require('../utils/utils');
    var countries=require('../data/countries.json');

    var controller={};


    controller.nationalities=function(req,res){
      var nationalitesData = require('../data/nationalities.json');
      res.json(nationalitesData);
    };
    controller.starterdeclarations =function(req,res){

      res.json(data_list.StarterDeclarations);
    };

    controller.payfrequencies =function(req,res){

      res.json(data_list.PayFrequency);
    };

    controller.taxbasis =function(req,res){

      res.json(data_list.TaxBasis);
    };

    controller.margins=function(req,res){

      res.json(data_list.Margin);
    };

    controller.holidaypayrules = function(req,res){

      res.json(data_list.HolidayPayRule);
    };

    controller.derogationcontracts = function(req,res){

      res.json(data_list.DerogationContract);
    };

    controller.servicesused = function(req,res){

      res.json(data_list.ServiceUsed);
    };

    controller.paymentterms=function(req,res){

      res.json(data_list.PaymentTerms);
    };

    controller.paymentmethods=function(req,res){

      res.json(data_list.PaymentMethod);
    };


    controller.holidays =function(req,res){

      res.json(data_list.Holidays);
    };

    controller.vehicletypes=function(req,res){

      res.json(data_list.VehicleTypes);
    };

    controller.priorities = function(req,res){

      res.json(data_list.Priorities);
    };

    controller.calllogtasktypes = function(req,res){

      res.json(data_list.CallLogTaskTypes);
    };

    controller.statuses = function(req,res){

      res.json(data_list.Statuses);
    };

    controller.createtasktypes=function(req,res){

      res.json(data_list.CreateTaskTypes);
    };

    controller.documenttypes=function(req,res){

      res.json(data_list.DocumentTypes);
    };

    controller.marginexceptiontypes = function(req,res){

      res.json(data_list.MarginExceptionTypes);
    };

    controller.reasons=function(req,res){

      res.json(data_list.Reasons);
    };

    controller.deductiontypes=function(req,res){

      res.json(data_list.DeductionTypes);
    };

    controller.agencytypes=function(req,res){

      res.json(data_list.AgencyTypes);
    };

    controller.invoicemethods=function(req,res){

      res.json(data_list.InvoiceMethods);
    };

    controller.statuslist=function(req,res){

      res.json(data_list.StatusList);
    };

    controller.countries=function(req,res){
      res.json(countries);
      
    }

    controller.margintypes=function(req,res){
      res.json(data_list.MarginTypes);
    }

    controller.roleslist=function(req,res){
      res.json(data_list.RolesList);
    }

    controller.mealslist=function(req,res){
      res.json(data_list.MealsList);
    }

    controller.transportationmeans=function(req,res){
      res.json(data_list.TransportationMeans);
    }
    
  return controller;
};
