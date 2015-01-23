// 'use strict';

var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
// var Sequelize=require('sequelize');
var mailer=require('../mailing/mailer');
var uuid = require('node-uuid');
var url=require('url');
var service={};
var utils=require('../utils/utils');
var queryutils=require('../utils/queryutils')(db);
var awsservice=require('../services/awsservice');
var candidatecommonservice=require(__dirname+'/candidatecommonservice');
var enums=require('../utils/enums');
var path=require('path');
var data_list=require('../data/data_list.json');
// service.simpleTest=function(someparam){
// 	return 'you sent me '+someparam;

// }

service.getUserAgencies=function(id){
	var query=db.User.findById(id).populate('worker.payroll_product.agency_id');
	return Q.nfcall(query.exec.bind(query));
}

service.getUserByEmail=candidatecommonservice.getUserByEmail;

service.getAllCandidates=function(request){
	
	return Q.Promise(function(resolve,reject){
		var q=db.User.find();
		
		q.where('user_type').equals('WK');
		
		queryutils.applySearch(q,db.User,request)
		.then(resolve,reject);
	});
	
}

service.uploadDocuments=function(id,documents){
	return Q.Promise(function(resolve,reject){
		service.getUser(id)
			.then(function(user){
				console.log('user is ');
				if(user){
					var docsAdded=[];
					console.log('user found');
					//console.log(user);
		         	///add document to user if applicable
		         	//console.log(user.documents);
		         	_.forEach(documents,function(doc,idx){

		         		var document=user.documents.create(doc);

		         		user.documents.push(document);
		         		docsAdded.push(document);
		         	});
		         	
					console.log('uploading documents');
     				var o=[];Q.Promise(function(){});
     				_.forEach(documents,function(doc){
     					
     					var data=doc.data;
     					var mimetype=doc.mime_type;
     					var newFileName=doc.generated_name;
     					// console.log('am here');
     					// console.log(data_list.DocumentTypes);
     					 var docEnum=utils.findInArray(data_list.DocumentTypes,doc.document_type,'code');
     					 // console.log('docEnum = '+docEnum);
     					 var rootPath=(docEnum||{}).path;
     					var folder=(rootPath||enums.document_types.OTHERS)+'/'+id+'/'+(doc.agency?doc.agency+'/':'');
     					// console.log('folder = '+folder);
     					// console.log('file key = '+newFileName );
     					console.log('Moving a Document   '+doc.generated_name+' to '+folder);
     					
     					o.push(awsservice.moveS3Object(process.env.S3_TEMP_FOLDER+newFileName,newFileName,folder));
     				});
     				
					console.log('saving user');
 					Q.all(o)
 						.then(function(){
 							return Q.nfcall(user.save.bind(user));
 						})
 						.then(function(){
 							resolve({result:true,object:{user:user,documents:docsAdded}});
 						},reject);

		         	// Q.nfcall(user.save.bind(user))
	         		// 	.then(function(){
	         				
	         				
	         		// 	})
			         // 	.then(function(){
			         // 		resolve({result:true,object:{user:user,documents:docsAdded}});
			         // 	},reject);

		        }
		        else{
		          reject({result:false,name:'NotFound',message:'User not found'});
		        }
			},reject);
	});
}

service.signup=function(opt,user,worker,contactdetail,bankdetail,taxdetail){
	var deff=Q.defer();
	db.User.findOne({email_address: user.email_address},function(err,existingUser){
		if(existingUser) {
			var response=
			{ 
				name: 'DuplicateRecordExists',
				message: 'Email address '+user.email_address+' already taken'
			};
			
			deff.reject(response);
			
		}
		else {

			
			var userModel;

			userModel=new db.User(user);

			userModel.worker=worker;
			
			console.log('going for validations');
			
			Q.allSettled([Q.nfcall(userModel.validate.bind(userModel))])
			.spread(function(userPromise){
				console.log('------------my validate result.......');
					// console.log(arguments);
					var response=
					{ 
						name: 'ModelValidationError',
						message: 'Validation error',
						errors:[]
					};
					var errObj={};
					var hasError=false;
					if(userPromise.state==='rejected'){
						hasError=true;
						errObj=userPromise.reason.errors;		
					}

					if(hasError){
						console.log('there are errors');
						response.errors=_.map(errObj,function(itm,val){
							return itm;
						});
						console.log(response.errors);
						deff.reject(response);	
						return;
					}

					console.log('saving.....');

					var guid=uuid.v1();
					console.log('Activation Code is : '+guid);
					
					userModel.activation_code=guid;

					
					console.log('saving started....');
					if(userModel.worker.tax_detail.p45_document_url && userModel.worker.tax_detail.p45_document_url.trim()!='')
					{
						userModel.worker.tax_detail.p45_document_url=_.last(userModel.worker.tax_detail.p45_document_url.split('/'));
						var doc={document_type:enums.document_types.P45,document_name:userModel.worker.tax_detail.p45_document_url,
							generated_name:userModel.worker.tax_detail.p45_document_url,uploaded_date:new Date()};

						userModel.documents.push(doc);

					}
					console.log('user id is : '+userModel._id);
					console.log('user is new ? '+userModel.isNew);
					
					Q.nfcall(userModel.save.bind(userModel))
						.then(function(){
								//console.log('saving worker');
								console.log('user id is '+userModel._id);
								console.log('user is new ? '+userModel.isNew);
								
								if(userModel.worker.tax_detail.p45_document_url && userModel.worker.tax_detail.p45_document_url.trim()!='')
								{

									var object_name=_.last(userModel.worker.tax_detail.p45_document_url.split('/'));
									return awsservice.moveS3Object(process.env.S3_P45_TEMP_FOLDER+object_name,object_name,process.env.S3_P45_FOLDER+userModel._id+'/')
									.then(function(){
										return sendMail(opt,userModel);
									});
								}
								else{
									opt.subject='Registration successful.'
									return sendMail(opt,userModel);
								}

						})
						.then(function(){
							deff.resolve({result:true,object:{userModel:userModel}});
						},function(err){
							console.log('rolling back');
							if(!userModel.isNew){
								console.log('rolling back user model');
								userModel.remove();
							}

							deff.reject(err);
						});


					} )
		.catch(function(){
			console.log('somer error in validation');
			deff.reject(arguments);
		});
}
});

return deff.promise;

}
function sendMail(opt,userModel){
		var newActivationLink=opt.activation_link+'/'+userModel.activation_code;

		var mailModel={title:userModel.title,first_name:userModel.first_name,last_name:userModel.last_name,
					activation_link:newActivationLink};
		var mailOption={to:userModel.email_address};
			return mailer.sendEmail(mailOption,mailModel,'user_registration_activation');
}



service.getUser=candidatecommonservice.getUser;

// service.getWorkerByUser=candidatecommonservice.getWorkerByUser;

service.updateBankDetails=function(user_id, bank_details){
	var deff=Q.defer()

	service.getUser(user_id)
	   .then(function(user){
	   		if(user){
	   			//db.sequelize.transaction(function(t){
					var props=utils.updateSubModel(user.worker.bank_detail,bank_details);
					return Q.nfcall(user.save.bind(user))
						.then(function(result){
							
							deff.resolve({result:true,object:user});
							
						},deff.reject);
	   		}
	   		else{
	   			deff.reject({name:'NotFound',message:'No Bank detail found'});
	   		}
		   	

	},deff.reject);

     return deff.promise;
}
	

service.updateContactDetail=function(user_id,user_information,worker_primary_address,worker_contact){
	return Q.Promise(function(resolve,reject){
		service.getUser(user_id)
		   .then(function(user){
		   		if(user){
		   				console.log('my user');
		   				console.log(user);
						var props=utils.updateSubModel(user.worker.contact_detail,worker_contact);
						utils.updateSubModel(user,user_information);
						utils.updateModel(user.worker,worker_primary_address);

						return Q.all([Q.nfcall(user.save.bind(user))])
							.then(function(result){
								
								resolve({result:true,object:user});
								
							},reject);
		   		}
		   		else{
		   			reject({name:'NotFound',message:'No Bank detail found'});
		   		}
			   	

		},reject);
	});

}

service.authenticateUser=function(email_address,password){
	var deff=Q.defer();
	console.log('authenticate user email address: '+email_address+' and password : '+password);
	service.getUserByEmail(email_address)
		.then(function(user){
			// console.log('user object');
			// console.log(user);
			if(user && user.is_active){
				utils.compareSecureString(user.password,password)
				.then(function(result){
					if(result){
						deff.resolve(user);
					}
					else{
						deff.reject({name:'InvalidLogin',message:'User not found',detail:'passwords do not match'});
					}
				});	
			}
			else{
				deff.reject({name:'InvalidLogin',message:'User not found',detail:(user && !user.is_active?'not activated '+user.is_active:'user object not found in db')});
			}
			
		},function(err){
			deff.reject(err);
		});

	return deff.promise;
}

service.uploadAvatar=function(id,data,newFileName,mimetype,folder){
	return Q.Promise(function(resolve,reject){
		service.getUser(id)
	      	.then(function(user){
		        if(user){
		         	//db.sequelize.transaction(function(t){
		         		user.avatar_file_name=newFileName;
		         		
		         	Q(Q.nfcall(user.save.bind(user))
		         			.then(function(){
		         				console.log('uploading avatar');

	         					return awsservice.putS3Object(data,newFileName,mimetype,folder);
		         				
		         			})
		         	)
		         	.then(function(){
		         		resolve({result:true,object:user});
		         	},reject);

		        }
		        else{
		          reject({result:false,name:'NotFound',message:'User not found'});
		        }
            
	        },reject);
	        
    });
		
}


 module.exports=service;
