'use strict';


module.exports = function(dbs){
  var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    db = dbs,
    router = express.Router(),
    candidateservice=require('../services/candidateservice'),
    utils=require('../utils/utils'),
    expressJwt = require('express-jwt'),
    restMiddleware=require('../middlewares/restmiddleware'),
    fs=require('fs'),
    path=require('path'),
    candidatecommonservice = require('../services/candidatecommonservice'),
    historyservice = require('../services/historyservice');
    var awsservice=require('../services/awsservice');
    var enums=require('../utils/enums');
    var _=require('lodash');
    var controller={};
    var awsService=require('../services/awsservice');


    controller.getAgencies = function(req, res){
      candidateservice.getUserAgencies(req.params.id)
        .then(function(user){
          var payroll_products = user.worker.payroll_product;
          //console.log(payroll_products);
          var agencies = [];
          _.forEach(payroll_products,function(payroll_product,key){
            agencies.push(payroll_product.agency_id);
          });
          res.json({result:true,objects:agencies});

        },res.sendFailureResponse);
    }
    controller.uploadDocuments=function(req,res){

      // var document_names=Array.isArray(req.body.document_name)?req.body.document_name:[req.body.document_name];
      // var document_types=Array.isArray(req.body.document_type)?req.body.document_type:[req.body.document_type];
      // var agencies=Array.isArray(req.body.agency)?req.body.agency:[req.body.agency];
      // var generated_names=Array.isArray(req.body.generated_name)?req.body.generated_name:[req.body.generated_name];
      // var mime_types=Array.isArray(req.body.mime_type)?req.body.mime_type:[req.body.mime_type];
      var docs=[];
      
      // console.log(req.body);
      var nowDate=new Date();
      _.forEach(req.body.documents,function(doc,idx){
          var document_name=doc.document_name;
          var document_type=doc.document_type;
          var agency=doc.agency;
          var newFileName=doc.generated_name;
          var mime_type=doc.mime_type;
          var document={
            document_name:document_name,
            document_type:document_type,
            agency:agency,
            generated_name:newFileName,
            mime_type:mime_type,
            uploaded_by:req.user.id,
            uploaded_date:nowDate
          };
          docs.push(document);
        });
      console.log('Documents');
    console.log(docs);

      //res.json('done');
      //return;

    //res.json(docs);
    //return;
      candidateservice.uploadDocuments(req.params.id,docs)
        .then(function(response){
          console.log('upload success');
          var documentvms=_.map(response.object.documents,function(doc){
              return candidatecommonservice.getDocumentViewModel(doc,response.object.user);
          });
          res.json({result:true,objects:documentvms});
        },res.sendFailureResponse);

    }


    controller.getAvatar =function(req,res){
      var exten=path.extname(req.params.avatarfilename);
      //console.log(res);
      //return;
      var newFileName=req.params.avatarfilename;
      var folder=process.env.S3_AVATARS_FOLDER+req.params.id+'/';
      console.log('retrieving avatar '+newFileName);
      awsservice.getS3Object(newFileName,folder)
        .then(function(data){
          //stream.pipe(res);
          res.setHeader('Content-Type',data.ContentType);
          res.setHeader('Accept-Ranges',data.AcceptRanges);
          res.setHeader('Content-Length',data.ContentLength);
          res.setHeader('ETag',data.ETag);
          res.setHeader('Expires',data.Expires);
          res.setHeader('Last-Modified',data.LastModified);
          //console.log(data);
          res.write(data.Body);
          res.end();
          console.log('file sent');
        },res.sendFailureResponse);
    }

    controller.postAvatar=function (req,res){
      //console.log(req.busboy);
      if(req.busboy){
        /////
          req.pipe(req.busboy);
          req.busboy.on('file',function(fieldName,file,filename,encoding, mimetype){
            console.log('Receiving file : '+ filename);
            //console.log(file);
            var newFileName=new Date().getTime().toString() + filename;
           
            var folder=process.env.S3_AVATARS_FOLDER+req.params.id+'/';
            file.on('data',function(data){
              if(data){
                candidateservice.uploadAvatar(req.params.id,data,newFileName,mimetype,folder)
                  .then(function(data){
                      var newUrl='api/candidate/'+req.params.id+'/avatar/'+newFileName;
                      res.json({result:true,object:data.object,url:newUrl});
                  },res.sendFailureResponse);

              }
              else{
                res.json({result:false,message:'File not streamed'});
              }
            
            })
            .on('error',res.sendFailureResponse);
          
          })
          .on('error',res.sendFailureResponse);
      }
      else{
        res.json({result:false,message:'No file posted'});
      }
    }

    controller.getCandidate=function (req,res){
      candidateservice.getUser(req.params.id,req._restOptions)
        .then(function(user){
          if(user) {
            
            console.log('have data');
            //console.log(user);
            var vm=getCandidateInfoViewModel(user);
            res.json({result:true,object:vm});
          }
          else{
            res.status(400).json({result:false,message:'User not found'});
          }
        },function(err){
          res.sendFailureResponse(err);
        });
    }


    controller.getAllCandidate=function (req,res){
      //console.log('user');
      //console.log(req.user);
      candidateservice.getAllCandidates(req._restOptions)
      .then(function(result){
        console.log('getAllCandidates over');
       // console.log(arguments);
        var vms=_.map(result.rows,function(user){
          
           var vm=getCandidateInfoViewModel(user);
           
           return vm;
         
        });
        var pagination=req._restOptions.pagination||{};
        var resp={result:true,objects:vms,meta:{limit:pagination.limit,offset:pagination.offset,total_count:result.count}};
        //console.log('about to send the message to client');

        res.json(resp);

      },function(err){
        res.sendFailureResponse(err);
      });
    }


    controller.getLoggedInUser=function (req,res){
      console.log(req.user);
      res.json(req.user);
    }

    controller.updateContactDetail=function (req, res){
      
      var contactDetail={
              phone:req.body.phone, 
              mobile:req.body.mobile, 
              alt_email:req.body.alt_email, 
              facebook:req.body.facebook, 
              linkedin:req.body.linkedin, 
              google:req.body.google
          };



      var addressDetails={
          contact_number:req.body.contact_number,
          ni_number:req.body.ni_number,
          birth_date:req.body.birth_date,
          address_1:req.body.address_1,
          address_2:req.body.address_2,
          address_3:req.body.address_3,
          town:req.body.town,
          county:req.body.county,
          post_code:req.body.post_code,
          nationality:req.body.nationality
        };
    //TODO: should be changed to req.user.id only after this api requires authentication
      //addressDetails.updated_by=(req.user?req.user.id:undefined);
        var user_information={
          email_address:req.body.email_address
        };
        

     // addressDetails.updated_by=(req.user?req.user.id:undefined);

      if(user_information.email_address){
        // console.log(user_information);
        candidatecommonservice.getUserByEmail(user_information.email_address)
          .then(function(existingUser){
            //console.log(existingUser);
            if(existingUser && existingUser.id!=req.params.id) {
              var response=
              { 
                name: 'DuplicateRecordExists',
                message: 'Email address '+user_information.email_address+' already taken'
              };
              
              res.sendFailureResponse(response);
              
            }
            else{
              submitUser();
            }
        },res.sendFailureResponse);
      }
      else{
        submitUser();
      }

      function submitUser(){
        candidateservice.updateContactDetail(req.params.id,user_information,addressDetails,contactDetail)
         .then(function(response){
          console.log('contact detail submited');
            var vm=getContactInformationViewModel(response.object,response.object.worker.contact_detail);
              res.json({result:true,object:vm});
           },function(err){
              res.sendFailureResponse(err);
           });
       }
    }

    controller.updateBankDetails=function (req, res){
      var bankDetails={
        bank_name:req.body.bank_name,
        account_name:req.body.account_name,
        sort_code:req.body.sort_code,
        account_no:req.body.account_no,
        bank_roll_no:req.body.bank_roll_no
      };
      //bankDetails.updated_by=(req.user?req.user.id:undefined);

      candidateservice.updateBankDetails(req.params.id, bankDetails)
         .then(function(response){
        res.json({result:true,object:getBankDetailViewModel(response.object.worker.bank_detail)});
        },function(err){
         res.sendFailureResponse(err);
      });
    }

    controller.getContactDetail=function (req,res){

        candidateservice.getUser(req.params.id)
          .then(function(user){
            if(user){
              var vm=getContactInformationViewModel(user,user.worker.contact_detail);
              res.json({result:true,object:vm});
            }
            else{
              res.json({result:false,message:'Contact Information not found'});
            }
          },res.sendFailureResponse);
    }

    controller.getBankDetail=function (req, res){
      candidateservice.getUser(req.params.id)
         .then(function(user){
            if(user){
               //res.json({result:true, object:{'bank_name':details.bank_name,'account_name':details.account_name,'sort_code':
               //         details.sort_code,'account_no':details.account_no,'bank_roll_no':details.bank_roll_no}}); 
              var vm=getBankDetailViewModel(user.worker.bank_detail);
              res.json({result:true, object: vm});
            }
            else {
               res.status(404).json({result:false, message:'Bank details not found'});
            }
         },res.sendFailureResponse);
    }

    controller.postCandidate=function (req, res) {
      
          console.log('post candidate started');
          //res.json('good');
          //return;
          var newUser={
            title:req.body.title,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email_address: req.body.email_address,
            user_type: 'WK'
          };


          var contactDetail={
              phone:req.body.phone, 
              mobile:req.body.mobile, 
              alt_email:req.body.alt_email, 
              facebook:req.body.facebook, 
              linkedin:req.body.linkedin, 
              google:req.body.google 
          };
          
          var bankDetail={
            bank_name:req.body.bank_name, 
            account_name:req.body.account_name, 
            sort_code:req.body.sort_code, 
            account_no:req.body.account_no, 
            bank_roll_no:req.body.bank_roll_no
          };
          

          var taxDetail={
              current_p45:req.body.current_p45,
              p45_uploaded:req.body.p45_uploaded,
              p46_uploaded:req.body.p46_uploaded,
              ni_number:      req.body.ni_number,
              p45_document_url:req.body.p45_document_url
          };

          var worker={
              contact_number: req.body.contact_number,
              
              birth_date:     req.body.birth_date,
              address_1:    req.body.address_1,
              address_2:      req.body.address_2,
              address_3:      req.body.address_3,
              town:           req.body.town,
              county:         req.body.county,
              post_code:      req.body.post_code,
              gender:         req.body.gender,
              nationality:    req.body.nationality,
              arrival_date:   utils.nullifyDate(req.body.arrival_date),
              recent_dep_date:utils.nullifyDate(req.body.recent_dep_date),
              emp_last_visit: req.body.emp_last_visit,
              agency_name:    req.body.agency_name,
              job_title:      req.body.job_title,
              start_date:     req.body.start_date,
              bank_detail:bankDetail,
              contact_detail:contactDetail,
              tax_detail: taxDetail
          };

          // worker.tax_detail.push(taxDetail);
          // new.worker=worker;
          var fullUrl = req.protocol + '://' + req.get('host') +'/register/activate/'+newUser.email_address;
          var opt={
              activation_link:fullUrl
          };
          console.log(newUser);
          candidateservice.signup(opt,newUser,worker)
            .then(function(response){
              console.log('in success ');
              // console.log(response.object.userModel);
              //console.log(_.omit(response.object.userModel,'activation_code'));
              //var usr=response.object.userModel;
              // var workerMod=response.object.workerModel;
              var userMod=response.object.userModel;
              // workerMod.user=userMod;
              // candidateservice.getWorkerByUser(userMod._id)
              //   .then(function(w){
                    var vm=getCandidateInfoViewModel(userMod);
                    res.json({result:true,object:vm});
                // },res.sendFailureResponse);
              

            },function(error){
               console.log('in failure');
               //res.json(true);
               console.log(error);
               res.sendFailureResponse(error);
            });
          

    }


    function getContactInformationViewModel(user,contact){
      var worker=user.worker;
      return {'_id':user.id,'email_address':user.email_address, 'address_1':worker.address_1,'address_2':worker.address_2,
          'address_3':worker.address_3,'county':worker.county,'post_code':worker.post_code,'nationality':worker.nationality,
          'contact_number':worker.contact_number,
          'phone':contact.phone,'mobile':contact.mobile,'alt_email':contact.alt_email,
                    'facebook':contact.facebook,'linkedin':contact.linkedin,'google':contact.google
            };
    }

    function getBankDetailViewModel(bankDetail){
      return { bank_name:bankDetail.bank_name, account_name:bankDetail.account_name,
                sort_code:bankDetail.sort_code, account_no:bankDetail.account_no, bank_roll_no:bankDetail.bank_roll_no
              };
    }

    function getCandidateInfoViewModel(usr){
      var worker=usr.worker||{};
      var contact_detail=worker.contact_detail||{};

        // return worker;
        // var usr=worker.user;
        // return worker;
        //console.log('id '+usr.id);
        //console.log(usr);
         return {_id:usr._id,title:usr.title,first_name:usr.first_name,last_name:usr.last_name,email_address:usr.email_address,
          birth_date:worker.birth_date,ni_number:worker.tax_detail.ni_number,
          contact_number:worker.contact_number,address_1:worker.address_1,address_2:worker.address_2,address_3:worker.address_3,
          town:worker.town,county:worker.county,post_code:worker.post_code,gender:worker.gender,nationality:worker.nationality,
          phone:contact_detail.phone,mobile:contact_detail.mobile,alt_email:contact_detail.alt_email,
          facebook:contact_detail.facebook,linkedin:contact_detail.linkedin,
          google:contact_detail.google,is_active:usr.is_active,candidate_ref:utils.padLeft(usr.candidate_no||'0',7,'0'),
          avatar_url:(usr.avatar_file_name?'api/candiates/'+usr.id+'/avatar/'+usr.avatar_file_name:'')
        };
    }


  return controller;
};


// controller.uploadDocuments=function(req,res){

//   var document_names=Array.isArray(req.body.document_name)?req.body.document_name:[req.body.document_name];
//   var document_types=Array.isArray(req.body.document_type)?req.body.document_type:[req.body.document_type];
//   var agencies=Array.isArray(req.body.agency)?req.body.agency:[req.body.agency];

//   //var foundValue=utils.parseEnumValue(enums.document_types,req.body.document_type);
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
//       var document_name=document_names[idx];
//       var document_type=document_types[idx];
//       var agency=agencies[idx]||undefined;
//       var newFileName=new Date().getTime().toString() + document_name+'.'+file.extension;
//       var document={
//         user:req.params.id,
//         document_name:document_name,
//         document_type:document_type,
//         agency:agency,
//         generated_name:newFileName,
//         mime_type:file.mimetype,
//         uploaded_by:req.user._id,
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
//       console.log(worker.tax_detail);
//       console.log(worker.tax_detail._id);
//       res.json(worker.user);
    
//   });
// });