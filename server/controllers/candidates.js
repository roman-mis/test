'use strict';

module.exports = function (dbs) {
    var candidateservice = require('../services/candidateservice')(dbs),
      utils = require('../utils/utils'),
      candidatecommonservice = require('../services/candidatecommonservice')(dbs),
      dataList = require('../data/data_list.json');
    var awsservice = require('../services/awsservice');
    var _ = require('lodash');
    var controller = {};
    var enums= require('../utils/enums');
    controller.postExpense = function () {

    };

    controller.getAgencies = function (req, res) {
        candidateservice.getUserAgencies(req.params.id)
          .then(function (user) {
              var payrollProducts = user.worker.payrollProduct;
              //console.log(payrollProducts);
              var agencies = [];
              _.forEach(payrollProducts, function (payrollProduct) {
                  agencies.push(payrollProduct.agency);
              });
              res.json({ result: true, objects: agencies });

          }, res.sendFailureResponse);
    };
    controller.uploadDocuments = function (req, res) {

        // var documentNames=Array.isArray(req.body.documentName)?req.body.documentName:[req.body.documentName];
        // var documentTypes=Array.isArray(req.body.documentType)?req.body.documentType:[req.body.documentType];
        // var agencies=Array.isArray(req.body.agency)?req.body.agency:[req.body.agency];
        // var generatedNames=Array.isArray(req.body.generatedName)?req.body.generatedName:[req.body.generatedName];
        // var mimeTypes=Array.isArray(req.body.mimeType)?req.body.mimeType:[req.body.mimeType];
        var docs = [];

        // console.log(req.body);
        var nowDate = new Date();
        _.forEach(req.body.documents, function (doc) {
            var documentName = doc.documentName;
            var documentType = doc.documentType;
            var agency = doc.agency;
            var newFileName = doc.generatedName;
            var mimeType = doc.mimeType;
            var document = {
                documentName: documentName,
                documentType: documentType,
                agency: agency,
                generatedName: newFileName,
                mimeType: mimeType,
                uploadedBy: req.user.id,
                uploadedDate: nowDate
            };
            docs.push(document);
        });
        console.log('Documents');
        console.log(docs);

        //res.json('done');
        //return;

        //res.json(docs);
        //return;
        candidateservice.uploadDocuments(req.params.id, docs)
          .then(function (response) {
              console.log('upload success');
              var documentvms = _.map(response.object.documents, function (doc) {
                  return candidatecommonservice.getDocumentViewModel(doc, response.object.user);
              });
              res.json({ result: true, objects: documentvms });
          }, res.sendFailureResponse);

    };


    controller.getAvatar = function (req, res) {
        //var exten=path.extname(req.params.avatarfilename);
        //console.log(res);
        //return;
        var newFileName = req.params.avatarfilename;
        var folder = process.env.S3_AVATARS_FOLDER + req.params.id + '/';
        console.log('retrieving avatar ' + newFileName);
        awsservice.getS3Object(newFileName, folder)
          .then(function (data) {
              //stream.pipe(res);
              res.setHeader('Content-Type', data.ContentType);
              res.setHeader('Accept-Ranges', data.AcceptRanges);
              res.setHeader('Content-Length', data.ContentLength);
              res.setHeader('ETag', data.ETag);
              res.setHeader('Expires', data.Expires);
              res.setHeader('Last-Modified', data.LastModified);
              //console.log(data);
              res.write(data.Body);
              res.end();
              console.log('file sent');
          }, res.sendFailureResponse);
    };

    controller.postAvatar = function (req, res) {
        //busboy has been removed. use multer instead
        //should be changed to upload the avatar from client side by providing signed url instead
        //console.log(req.busboy);
        if (req.busboy) {
            /////
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldName, file, filename, encoding, mimetype) {
                console.log('Receiving file : ' + filename);
                //console.log(file);
                var newFileName = new Date().getTime().toString() + filename;

                var folder = process.env.S3_AVATARS_FOLDER + req.params.id + '/';
                file.on('data', function (data) {
                    if (data) {
                        candidateservice.uploadAvatar(req.params.id, data, newFileName, mimetype, folder)
                          .then(function (data) {
                              var newUrl = 'api/candidate/' + req.params.id + '/avatar/' + newFileName;
                              res.json({ result: true, object: data.object, url: newUrl });
                          }, res.sendFailureResponse);

                    }
                    else {
                        res.json({ result: false, message: 'File not streamed' });
                    }

                })
                .on('error', res.sendFailureResponse);

            })
            .on('error', res.sendFailureResponse);
        }
        else {
            res.json({ result: false, message: 'No file posted' });
        }
    };

    controller.getCandidate = function (req, res) {
        candidateservice.getUser(req.params.id, req._restOptions)
          .then(function (user) {
              if (user) {

                  console.log('have data');
                  //console.log(user);
                  var vm = getCandidateInfoViewModel(user);
                  res.json({ result: true, object: vm });
              }
              else {
                  res.status(400).json({ result: false, message: 'User not found' });
              }
          }, function (err) {
              res.sendFailureResponse(err);
          });
    };

    controller.getCandidatePayrollValue = function (req, res) {

        candidateservice.getUser(req.params.id)
            .then(function (user) {
                if (user) {
                    var vm = getCandidatePayrollValues(user);
                    res.json({ result: true, object: vm });
                }
                else {
                    res.status(400).json({ result: false, message: 'User not found' });
                }
            }, function (err) {
                res.sendFailureResponse(err);
            });
    };

    controller.updateStatus = function (req, res) {

        candidateservice.updateStatus(req.params.id, req.body.status).
        then(function (resp) {
            res.json(resp);
        }, function (err) {
            res.Json(err);
        });
    };

    controller.getAllCandidate = function (req, res) {
        //console.log('user');
        //console.log(req.user);

        candidateservice.getAllCandidates(req._restOptions)
        .then(function (result) {
            // console.log(arguments);
            var vms = _.map(result.rows, function (user) {

                var vm = getCandidateInfoViewModel(user);

                return vm;

            });
            var pagination = req._restOptions.pagination || {};
            var resp = { result: true, objects: vms, meta: { limit: pagination.limit, offset: pagination.offset, totalCount: result.count } };
            //console.log('about to send the message to client');

            res.json(resp);

        }, function (err) {
            res.sendFailureResponse(err);
        });
    };


    controller.getLoggedInUser = function (req, res) {
        console.log(req.user);
        res.json(req.user);
    };

    controller.updateContactDetail = function (req, res) {

        var contactDetail = {
            phone: req.body.phone,
            mobile: req.body.mobile,
            altEmail: req.body.altEmail,
            facebook: req.body.facebook,
            linkedin: req.body.linkedin,
            google: req.body.google
        };



        var addressDetails = {
            contactNumber: req.body.contactNumber,
            niNumber: req.body.niNumber,
            birthDate: req.body.birthDate,
            address1: req.body.address1,
            address2: req.body.address2,
            address3: req.body.address3,
            town: req.body.town,
            county: req.body.county,
            postCode: req.body.postCode,
            nationality: req.body.nationality,
            gender: req.body.gender
        };
        //TODO: should be changed to req.user.id only after this api requires authentication
        //addressDetails.updatedBy=(req.user?req.user.id:undefined);
        var userInformation = {
            emailAddress: req.body.emailAddress,
            contactDetail: contactDetail
        };


        // addressDetails.updatedBy=(req.user?req.user.id:undefined);

        function submitUser() {
            candidateservice.updateContactDetail(req.params.id, userInformation, addressDetails)
           .then(function (response) {
               console.log('contact detail submited');
               var vm = getContactInformationViewModel(response.object, response.object.contactDetail);
               res.json({ result: true, object: vm });
           }, function (err) {
               res.sendFailureResponse(err);
           });
        }

        if (userInformation.emailAddress) {
            // console.log(userInformation);
            candidatecommonservice.getUserByEmail(userInformation.emailAddress)
              .then(function (existingUser) {
                  //console.log(existingUser);
                  if (existingUser && existingUser.id !== req.params.id) {
                      var response =
                      {
                          name: 'DuplicateRecordExists',
                          message: 'Email address ' + userInformation.emailAddress + ' already taken'
                      };

                      res.sendFailureResponse(response);

                  }
                  else {
                      submitUser();
                  }
              }, res.sendFailureResponse);
        }
        else {
            submitUser();
        }


    };

    controller.updateBankDetails = function (req, res) {
        var bankDetails = {
            bankName: req.body.bankName,
            accountName: req.body.accountName,
            sortCode: req.body.sortCode,
            accountNo: req.body.accountNo,
            bankRollNo: req.body.bankRollNo
        };
        //bankDetails.updatedBy=(req.user?req.user.id:undefined);

        candidateservice.updateBankDetails(req.params.id, bankDetails)
           .then(function (response) {
               res.json({ result: true, object: getBankDetailViewModel(response.object.worker.bankDetail) });
           }, function (err) {
               res.sendFailureResponse(err);
           });
    };

    controller.getContactDetail = function (req, res) {

        candidateservice.getUser(req.params.id)
          .then(function (user) {
              console.log(user);
              if (user) {
                  var vm = getContactInformationViewModel(user, user.contactDetail);
                  res.json({ result: true, object: vm });
              }
              else {
                  res.json({ result: false, message: 'Contact Information not found' });
              }
          }, res.sendFailureResponse);
    };
    controller.getLastLog = function (req, res) {

        candidateservice.getLogs(req.params.id).then(function (doc) {
            res.json(doc);

        }, res.sendFailureResponse);
    };

    controller.getBankDetail = function (req, res) {
        candidateservice.getUser(req.params.id)
           .then(function (user) {
               if (user) {
                   //res.json({result:true, object:{'bank_name':details.bankName,'account_name':details.accountName,'sort_code':
                   //         details.sortCode,'account_no':details.accountNo,'bank_roll_no':details.bankRollNo}});
                   var vm = getBankDetailViewModel(user.worker.bankDetail);
                   res.json({ result: true, object: vm });
               }
               else {
                   res.status(404).json({ result: false, message: 'Bank details not found' });
               }
           }, res.sendFailureResponse);
    };

    controller.postCandidate = function (req, res) {

        handlePostCandidate(req, function (err, response) {
            if (err) {
                res.sendFailureResponse(err);
            }
            res.json(response);

        });
    };

    controller.postCandidateByAdmin = function (req, res) {

        req.skipEmail = 'true';
        handlePostCandidate(req, function (err, response) {
            if (err) {
                res.sendFailureResponse(err);
            }
            res.json(response);

        });
    };

    /**
     * Handles the registration of a candidate
     * @param request
     * @param callback
     */
    function handlePostCandidate(request, callback) {

        console.log('post candidate started');
        //res.json('good');
        //return;

        var contactDetail = {
            phone: request.body.phone,
            mobile: request.body.mobile,
            altEmail: request.body.altEmail,
            facebook: request.body.facebook,
            linkedin: request.body.linkedin,
            google: request.body.google
        };

        var newUser = {
            title: request.body.title,
            firstName: request.body.firstName,
            middleName: request.body.middleName,
            lastName: request.body.lastName,
            emailAddress: request.body.emailAddress,
            userType: 'WK',
            contactDetail: contactDetail
        };

        var bankDetail = {
            bankName: request.body.bankName,
            accountName: request.body.accountName,
            sortCode: request.body.sortCode,
            accountNo: request.body.accountNo,
            bankRollNo: request.body.bankRollNo
        };


        var taxDetail = {
            currentP45: request.body.currentP45,
            p45Uploaded: request.body.p45Uploaded,
            p46Uploaded: request.body.p46Uploaded,
            niNumber: request.body.niNumber,
            p45DocumentUrl: request.body.p45DocumentUrl,
            employeesNIpaid: request.body.employeesNIpaid
        };

        var worker = {
            sector: request.body.sector,
            birthDate: request.body.birthDate,
            address1: request.body.address1,
            address2: request.body.address2,
            address3: request.body.address3,
            town: request.body.town,
            county: request.body.county,
            postCode: request.body.postCode,
            gender: request.body.gender,
            nationality: request.body.nationality,
            arrivalDate: utils.nullifyDate(request.body.arrivalDate),
            recentDepDate: utils.nullifyDate(request.body.recentDepDate),
            empLastVisit: request.body.empLastVisit,
            agencyName: request.body.agencyName,
            jobTitle: request.body.jobTitle,
            startDate: request.body.startDate,
            status: enums.candiateStatus.Submitted,
            bankDetail: bankDetail,

            taxDetail: taxDetail
        };
        //res.json({user:newUser,worker:worker});
        //return;

        // worker.taxDetail.push(taxDetail);
        // new.worker=worker;
        var fullUrl = request.protocol + '://' + request.get('host') + '/register/activate/' + newUser.emailAddress;
        var opt = {
            activationLink: fullUrl,
            skipEmail: request.skipEmail
        };

        console.log(newUser);
        candidateservice.signup(opt, newUser, worker)
            .then(function (response) {
                console.log('in success ');
                // console.log(response.object.userModel);
                //console.log(_.omit(response.object.userModel,'activation_code'));
                //var usr=response.object.userModel;
                // var workerMod=response.object.workerModel;
                var userMod = response.object.userModel;
                // workerMod.user=userMod;
                // candidateservice.getWorkerByUser(userMod._id)
                //   .then(function(w){
                var vm = getCandidateInfoViewModel(userMod);
                callback(null, { result: true, object: vm });
                // },res.sendFailureResponse);


            }, function (error) {
                console.log('in failure');
                //res.json(true);
                console.log(error);
                callback(error);
            });


    }

    function getContactInformationViewModel(user, contact) {
        var worker = user.worker;
        return {
            '_id': user.id,'firstName':user.firstName, 'emailAddress': user.emailAddress, 'address1': worker.address1, 'address2': worker.address2,
            'address3': worker.address3, 'county': worker.county, 'postCode': worker.postCode, 'nationality': worker.nationality,
            'contactNumber': worker.contactNumber, gender: worker.gender,'candidateNo':user.candidateNo,
            'phone': contact.phone, 'mobile': contact.mobile, 'altEmail': contact.altEmail,
            'facebook': contact.facebook, 'linkedin': contact.linkedin, 'google': contact.google, status: user.worker.status,town: worker.town
        };
    }

    function getBankDetailViewModel(bankDetail) {
        return {
            bankName: bankDetail.bankName, accountName: bankDetail.accountName,
            sortCode: bankDetail.sortCode, accountNo: bankDetail.accountNo, bankRollNo: bankDetail.bankRollNo
        };
    }

    function getCandidatePayrollValues(usr) {
        var worker = usr.worker || {};

        return {
            _id: usr._id, title: usr.title, firstName: usr.firstName, lastName: usr.lastName, emailAddress: usr.emailAddress,
            payrollValues : worker.payrollValues
        };
    }

    function getCandidateInfoViewModel(usr) {
        var worker = usr.worker || {};
        var contactDetail = usr.contactDetail || {};

        // return worker;
        // var usr=worker.user;
        // return worker;
        //console.log('id '+usr.id);
        //console.log(usr);
        return {
            _id: usr._id, title: usr.title,
            fullName : (usr.firstName + ' ' + usr.lastName), firstName: usr.firstName, lastName: usr.lastName,middleName:usr.middleName, emailAddress: usr.emailAddress,
            birthDate: worker.birthDate, niNumber: worker.taxDetail.niNumber,
            contactNumber: worker.contactNumber, address1: worker.address1, address2: worker.address2, address3: worker.address3,
            town: worker.town, county: worker.county, postCode: worker.postCode, gender: worker.gender, nationality: worker.nationality,
            phone: contactDetail.phone, mobile: contactDetail.mobile, altEmail: contactDetail.altEmail,
            facebook: contactDetail.facebook, linkedin: contactDetail.linkedin,
            google: contactDetail.google, isActive: usr.isActive, candidateRef: utils.padLeft(usr.candidateNo || '0', 7, '0'),
            avatarUrl: (usr.avatarFileName ? 'api/candiates/' + usr.id + '/avatar/' + usr.avatarFileName : '')
        };
    }

    controller.patchVehicleInformation = function (req, res) {
        var vehicleInfo = {
            vehicleCode: req.params.code,
            fuelType: req.body.fuelType,
            engineSize: req.body.engineSize,
            make: req.body.make,
            registration: req.body.registration,
            companyCar: req.body.companyCar
        };

        candidateservice.updateVehicleInformation(req.params.id, vehicleInfo)
          .then(function (user) {
              res.json({ result: true, object: vehicleInformationVm(user, req.params.code) });
          }, function (err) {
              console.log(err);
              res.sendFailureResponse(err);
          });
    };

    controller.getVehicleInformation = function (req, res) {
        candidateservice.getUser(req.params.id)
           .then(function (user) {
               if (user) {
                   var vm = vehicleInformationVm(user, req.params.code);
                   res.json({ result: true, object: vm });
               }
               else {
                   res.status(404).json({ result: false, message: 'Vehicle Information not found' });
               }
           }, res.sendFailureResponse);
    };

    function vehicleInformationVm(user, code) {
        var vehicleInformation = {};
        _.forEach(user.worker.vehicleInformation, function (vehicle) {
            if (vehicle.vehicleCode === code) {
                vehicleInformation = {
                    vehicleCode: utils.findInArray(dataList.VehicleTypes, vehicle.vehicleCode, 'code'),
                    fuelType: utils.findInArray(dataList.Fuels, vehicle.fuelType, 'code'),
                    engineSize: utils.findInArray(dataList.EngineSizes, vehicle.engineSize, 'code'),
                    make: vehicle.make,
                    registration: vehicle.registration,
                    companyCar: vehicle.companyCar
                };
                return false;
            }
        });
        return {
            _id: user._id,
            vehicleInformaiton: vehicleInformation
        };
    }

    return controller;
};


// controller.uploadDocuments=function(req,res){

//   var documentNames=Array.isArray(req.body.documentName)?req.body.documentName:[req.body.documentName];
//   var documentTypes=Array.isArray(req.body.documentType)?req.body.documentType:[req.body.documentType];
//   var agencies=Array.isArray(req.body.agency)?req.body.agency:[req.body.agency];

//   //var foundValue=utils.parseEnumValue(enums.documentTypes,req.body.documentType);
//   //console.log(foundValue);
//   // res.json(foundValue);
//   // if(!foundValue){
//   //   res.sendFailureResponse({message:'Wrong Document Type selected'});
//   //   return false;
//   // }

//   if(!req.files || req.files.length<=0){
//     res.sendFailureResponse({message:'No document uploaded'});
//     return false;
//   }



//    //console.log(req.files);
//   // var file=req.files[0];
//   var docs=[];
//   var files=req.files.document?Array.isArray(req.files.document)?req.files.document:[req.files.document]:[];
//   console.log('files '+files.length);
//   console.log(files.length);
//   _.forEach(files,function(file,idx){
//       var documentName=documentNames[idx];
//       var documentType=documentTypes[idx];
//       var agency=agencies[idx]||undefined;
//       var newFileName=new Date().getTime().toString() + documentName+'.'+file.extension;
//       var document={
//         user:req.params.id,
//         documentName:documentName,
//         documentType:documentType,
//         agency:agency,
//         generatedName:newFileName,
//         mimeType:file.mimetype,
//         uploadedBy:req.user._id,
//         data:file.buffer
//       };
//       docs.push(document);
//     });
// //res.json(docs);
// //return;
//   candidateservice.uploadDocuments(req.params.id,docs)
//     .then(function(response){
//       var documentvms=_.map(response.object.documents,function(doc){
//           return candidatecommonservice.getDocumentViewModel(doc);
//       });
//       res.json({result:true,object:documentvms});
//     },res.sendFailureResponse);

// }


// router.get('/user1/:id',function(req,res){
//   db.User.findById(req.params.id)
//   .exec(function(err,user){

//       res.json(user);

//   });
// });

// router.get('/user2/:id',function(req,res){

//    console.log(db.DB.model('Worker').schema.paths.user);

// res.json('trure');
// return;
//   db.Worker.findOne({user:req.params.id})
//   .populate('user')
//   .exec(function(err,worker){
//       console.log(worker.taxDetail);
//       console.log(worker.taxDetail._id);
//       res.json(worker.user);

//   });
// });
