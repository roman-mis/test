'use strict';

module.exports = function(){

    var dataList=require('../data/data_list.json');
    var countries=require('../data/countries.json');
    var adminTemplatesData=require('../data/admin_templates_data.json');

    var controller={};


    controller.nationalities=function(req,res){
      var nationalitesData = require('../data/nationalities.json');
      res.json(nationalitesData);
    };
    controller.starterdeclarations =function(req,res){

      res.json(dataList.StarterDeclarations);
    };

    controller.payfrequencies =function(req,res){

      res.json(dataList.PayFrequency);
    };

    controller.taxbasis =function(req,res){

      res.json(dataList.TaxBasis);
    };

    controller.margins=function(req,res){

      res.json(dataList.Margin);
    };

    controller.holidaypayrules = function(req,res){

      res.json(dataList.HolidayPayRule);
    };

    controller.derogationcontracts = function(req,res){

      res.json(dataList.DerogationContract);
    };

    controller.servicesused = function(req,res){

      res.json(dataList.ServiceUsed);
    };

    controller.paymentterms=function(req,res){

      res.json(dataList.PaymentTerms);
    };

    controller.paymentmethods=function(req,res){

      res.json(dataList.PaymentMethod);
    };


    controller.holidays =function(req,res){

      res.json(dataList.Holidays);
    };

    controller.vehicletypes=function(req,res){

      res.json(dataList.VehicleTypes);
    };

    controller.priorities = function(req,res){

      res.json(dataList.Priorities);
    };

    controller.calllogtasktypes = function(req,res){

      res.json(dataList.CallLogTaskTypes);
    };

    controller.statuses = function(req,res){

      res.json(dataList.Statuses);
    };

    controller.createtasktypes=function(req,res){

      res.json(dataList.CreateTaskTypes);
    };

    controller.documenttypes=function(req,res){

      res.json(dataList.DocumentTypes);
    };

    controller.marginexceptiontypes = function(req,res){

      res.json(dataList.MarginExceptionTypes);
    };

    controller.reasons=function(req,res){

      res.json(dataList.Reasons);
    };

    controller.deductiontypes=function(req,res){

      res.json(dataList.DeductionTypes);
    };

    controller.agencytypes=function(req,res){

      res.json(dataList.AgencyTypes);
    };

    controller.invoicemethods=function(req,res){

      res.json(dataList.InvoiceMethods);
    };

    controller.statuslist=function(req,res){

      res.json(dataList.StatusList);
    };

    controller.countries=function(req,res){
      res.json(countries);

    };

    controller.margintypes=function(req,res){
      res.json(dataList.MarginTypes);
    };

    controller.roleslist=function(req,res){
      res.json(dataList.RolesList);
    };

    controller.mealslist=function(req,res){
      res.json(dataList.MealsList);
    };

    controller.transportationmeans=function(req,res){
      res.json(dataList.TransportationMeans);
    };

    controller.otherexpensetypes=function(req,res){
      res.json(dataList.OtherExpenseTypes);
    };

    controller.getAdminTemplatesData=function (req,res){
      res.json(adminTemplatesData[req.params.type]);
    };

    controller.fuels=function(req,res){
      res.json(dataList.Fuels);
    };

    controller.enginesizes=function(req,res){
      res.json(dataList.EngineSizes);
    };
  return controller;
};
