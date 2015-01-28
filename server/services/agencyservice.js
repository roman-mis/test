var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
var mailer=require('../mailing/mailer');
var uuid = require('node-uuid');
var url=require('url');
var service={};
var utils=require('../utils/utils');
var queryutils=require('../utils/queryutils')(db);
var awsservice=require('../services/awsservice');
var userservice=require('../services/userservice');
var candidatecommonservice=require('../services/candidatecommonservice');
var Schema=require('mongoose').Schema;
var path=require('path');

service.getAllAgencies=function(request){
	
	return Q.Promise(function(resolve,reject){
		var q=db.Agency.find();
		
		queryutils.applySearch(q,db.Agency,request)
		.then(resolve,reject);
	});
	
}

service.saveAgency = function(agencyDetails, agencyId){
	return Q.Promise(function(resolve,reject){	
		var agency;
		if(agencyId == null){
			// Add Agency
			agency = new db.Agency(agencyDetails);

			var branch = {
				name: 				 "Head Office",
			    address1:            agencyDetails.address1,
			    address2:            agencyDetails.address2,
			    address3:            agencyDetails.address3,
				town:                agencyDetails.town,
			    postcode:            agencyDetails.postcode,
			    branchType:         "HQ"
			}

			agency.branches.push(branch);

			Q.nfcall(agency.save.bind(agency))
			.then(function(){
					resolve(agency);
				},reject);
		}else{
			// Update Agency
			service.getAgency(agencyId).then(function(agency){
				var previousLogoFile=agency.logoFileName;
				utils.updateSubModel(agency, agencyDetails);
				
				_.forEach(agency.branches, function(branch, key){
					if(branch.branchType == "HQ"){
						var branchDetails = {
							address1:            agencyDetails.address1,
						    address2:            agencyDetails.address2,
						    address3:            agencyDetails.address3,
							town:                agencyDetails.town,
						    postcode:            agencyDetails.postcode
						};
						utils.updateSubModel(agency.branches[key], branchDetails);
						return false;
					}
				});

				Q.nfcall(agency.save.bind(agency))
				.then(function(){
					// console.log('agencyDetails.logo_file_name    '+agencyDetails.logoFileName);
					// console.log('previousLogoFile     '+previousLogoFile);
					// console.log('are big equal '+(previousLogoFile.trim().toLowerCase()==agencyDetails.logoFileName.trim().toLowerCase()));
					// console.log('haha agencyDetails.logo_file_name.trim().toLowerCase()    '+agencyDetails.logoFileName.trim().toLowerCase());
					// console.log('previousLogoFile.trim().toLowerCase()     '+previousLogoFile.trim().toLowerCase());
					

					if(agencyDetails.logoFileName && agencyDetails.logoFileName.trim()!='' && previousLogoFile && previousLogoFile.trim()!='' && (previousLogoFile.trim().toLowerCase()!=agencyDetails.logoFileName.trim().toLowerCase())){
						console.log('removing previous logo');
						var folder=process.env.S3_AGENCY_FOLDER+agency._id+'/';
					 	return awsservice.deleteS3Object(previousLogoFile,folder);
					}
					return true;
					
				})
				.then(function(){
					resolve(agency);
				},reject);
			});
		}
	});
}



service.saveAgencyContact = function(agencyId, contactDetails){
	return Q.Promise(function(resolve,reject){
		service.getAgency(agencyId)
			.then(function(agency){
				if(agency){
					utils.updateSubModel(agency.contactInformation, contactDetails);
					
					Q.nfcall(agency.save.bind(agency))
					.then(function(){
						resolve(agency);
					},reject);
				}else{
					reject({result:false, name:'NOTFOUND', message:'Agency not found'});
				}
			},reject);
	});
}

service.getAgency=function(id){
	var q=db.Agency.findById(id).populate('branches.consultants.user');
	return Q.nfcall(q.exec.bind(q));
}

service.getAgencyByBranchId=function(id){
	var q=db.Agency.findOne({'branches._id':id}).populate('branches.consultants.user');
	return Q.nfcall(q.exec.bind(q));
}

service.getAgencyByConsultantId=function(id){
	var q=db.Agency.findOne({'branches.consultants._id':id}).populate('branches.consultants.user');
	return Q.nfcall(q.exec.bind(q));
}
service.getConsultant=function(id){
	return Q.Promise(function(resolve,reject){
		service.getAgencyByConsultantId(id)
			.then(function(agency){
				var consultant;
				if(agency){
					_.forEach(agency.branches, function(branch,key){
					consultant = branch.consultants.id(id);
					if(consultant)
						
						consultant.agency=agency;
						
						consultant.branch=branch;
						return false;
					});
				}
				
				resolve(consultant);

			},reject);
	});
}

service.getUserByConsultantId=function(id){
	return Q.Promise(function(resolve,reject){
		service.getConsultant(id)
		.then(function(consultant){
			if(consultant && consultant.user){
				userservice.getUser(consultant.user)
				.then(function(user){
					resolve(user);
				},reject);
			}else{
				resolve();
			}
		},reject);
	});
}


service.postBranch=function(agencyId, branchInfo){
	return Q.Promise(function(resolve,reject){
		service.getAgency(agencyId)
			.then(function(agency){
				if(agency){
					// Add
					var branch=agency.branches.create(branchInfo);
					agency.branches.push(branch);
					Q.nfcall(agency.save.bind(agency))
					.then(function(){
						resolve({result:true, object:{agency: agency,branch: branch}});
					},reject);
				}else{
					reject({result:false,name:'NOTFOUND',message:'Agency not found'});
				}
			},reject);
	});
};

service.patchBranch=function(branchId, branchInfo){
	return Q.Promise(function(resolve,reject){
		service.getAgencyByBranchId(branchId)
			.then(function(agency){
				if(agency){
					// Update
					var branch = agency.branches.id(branchId);
					if(branch){
						utils.updateSubModel(agency.branches.id(branchId), branchInfo);
						Q.nfcall(agency.save.bind(agency))
						.then(function(){
							resolve({result:true, object:{agency:agency, branch: branch}});
						},reject);
					}else{
						reject({result:false,name:'NOTFOUND',message:'Branch not found'});
					}
				}else{
					reject({result:false,name:'NOTFOUND',message:'Agency not found'});
				}
			},reject);
	});
};

service.getBranch=function(branchId){
	var query=db.Agency.findOne({'branches._id':branchId});
	return Q.Promise(function(resolve,reject){
		Q.nfcall(query.exec.bind(query))
			.then(function(agency){

				if(agency){
					var branch=agency.branches.id(branchId);
					resolve({agency:agency, branch:branch});
				}
				else{
					reject(null);
				}
			},reject);
	});
}

service.deleteBranch=function(branchId){
	return Q.Promise(function(resolve,reject){
		service.getAgencyByBranchId(branchId)
			.then(function(agency){
				if(agency){
					var branch = agency.branches.id(branchId);
					if(branch){
						// Get Index
						var index = agency.branches.indexOf(branch);
						agency.branches.splice(index, 1);

						Q.nfcall(agency.save.bind(agency))
						.then(function(){
							resolve({result:true});
						},reject);
					}else{
						reject({result:false,name:'NOTFOUND',message:'Branch not found'});
					}
				}else{
					reject({result:false,name:'NOTFOUND',message:'Agency not found'});
				}
			},reject);
	});
}

service.postConsultant=function(branchId, consultantInfo){
	return Q.Promise(function(resolve,reject){
		service.getAgencyByBranchId(branchId)
			.then(function(agency){
				if(agency){
					var branch = agency.branches.id(branchId);
					if(branch){
						// For Consultant User Login
						var fullUrl = global.baseUrl + '/register/activate/'+consultantInfo.emailAddress;
						var opt={
						  activationLink:fullUrl,
						  subject:'You have been added as a consultant.'
						};

						var guid=uuid.v1();
						console.log('Activation Code is : '+guid);
						
						var newUser = {
							firstName: consultantInfo.firstName,
							lastName: consultantInfo.lastName,
							emailAddress: consultantInfo.emailAddress,
							userType: 'AC',
							contactDetail:{phone:consultantInfo.phone},
							activationCode: guid
						}
						
						userservice.createUser(opt, newUser).then(function(user){
							// Add
							consultantInfo['user']=user.object._id;
							var consultant = branch.consultants.create(consultantInfo);
							agency.branches.id(branchId).consultants.push(consultant);

							Q.nfcall(agency.save.bind(agency))
							.then(function(){
								resolve({result:true,object:{agency:agency, branch:branch, consultant:consultant, user: user}});
							},reject);
						},reject);
					}else{
						reject({result:false,name:'NOTFOUND',message:'Branch not found'});
					}
				}else{
					reject({result:false,name:'NOTFOUND',message:'Agency not found'});
				}
			},reject);
	});
};

service.patchConsultant=function(consultantId, consultantInfo){
	return Q.Promise(function(resolve,reject){
		service.getConsultant(consultantId)
			.then(function(consultant){
				
				if(consultant){
					var agency=consultant.agency;
					var branch=consultant.branch;
					utils.updateSubModel(consultant, consultantInfo);
					
					if(consultantInfo.emailAddress){
						//check duplicate email address.
						console.log('checking duplicate user');
						userservice.checkDuplicateUser(consultantInfo.emailAddress,{_id:consultant.user._id})
							.then(function(){
								updateConsultant(agency,consultant)
									.then(function(result){
										resolve({result:true,object:{agency:agency, branch:branch, consultant:result.object.consultant,user:result.object.user}});
									},reject)
								},reject);
					}else{
						updateConsultant(agency, consultant)
						.then(function(result){
							resolve({result:true,object:{agency:agency, branch:branch, consultant:result.object.consultant,user:result.object.user}});
						},reject);
					}
					
				}else{
						
					reject({result:false,name:'NOTFOUND',message:'Consultant not found'});
				}
			},reject);
	});
}

function updateConsultant(agency,consultant){
	return Q.Promise(function(resolve,reject){
		console.log('retrieving consultant user');
		candidatecommonservice.getUser(consultant.user)
			.then(function(user){
				//create new user if doesn't exists
				if(!user){
					console.log('user for consultant not found');
				}

				user=user|| new db.User({});

				user.firstName = consultant.firstName;
				user.lastName = consultant.lastName;
				user.emailAddress = consultant.emailAddress;
				user.contactDetail=user.contactDetail||{};
				user.userType= 'AC';
				user.contactDetail.phone=consultant.phone;
				consultant.user=user._id;
				console.log('updating consultant user');
				Q.all([Q.nfcall(agency.save.bind(agency)), Q.nfcall(user.save.bind(user))])
				.then(function(){
					consultant.user=user;
					resolve({result:true,object:{consultant:consultant,user:user}});
				},reject);
			},reject);
	});
}

service.deleteConsultant=function(consultantId){
	return Q.Promise(function(resolve,reject){
		service.getConsultant(consultantId)
		.then(function(consultant){
			if(consultant){
				userservice.removeUser(consultant.user._id)
				.then(function(response){
					// Get Index
					var index = consultant.branch.consultants.indexOf(consultant);
					consultant.branch.consultants.splice(index, 1);

					Q.nfcall(consultant.agency.save.bind(consultant.agency))
					.then(function(){
						resolve({result:true});
					},reject);
				},function(err){
					reject({result:false,name:'ERROR',message:'Delete Msg'});
				});
			}
		},reject);
	});
};

service.saveAgencyPayroll = function(agencyId, defaultInvoicingDetails, defaultPayrollDetails){
	return Q.Promise(function(resolve,reject){
		service.getAgency(agencyId)
			.then(function(agency){
				if(agency){
					// Default Invoicing
					utils.updateSubModel(agency.defaultInvoicing, defaultInvoicingDetails); // Edit
					
					// Default Payroll
					utils.updateSubModel(agency.defaultPayroll, defaultPayrollDetails); // Edit
					
					Q.nfcall(agency.save.bind(agency))
					.then(function(){
						resolve(agency);
					},reject);
				}else{
					reject({result:false, name:'NOTFOUND', message:'Agency not found'});
				}
			},reject);
	});
};

service.saveAgencySales = function(agencyId, salesDetails, administrationCostDetails){
	return Q.Promise(function(resolve,reject){
		service.getAgency(agencyId)
			.then(function(agency){
				if(agency){
					
					// Default Invoicing
					utils.updateSubModel(agency.sales, salesDetails); // Edit
					
					// Default Payroll
					utils.updateSubModel(agency.administrationCost, administrationCostDetails); // Edit
					
					Q.nfcall(agency.save.bind(agency))
					.then(function(){
						resolve(agency);
					},reject);
				}else{
					reject({result:false, name:'NOTFOUND', message:'Agency not found'});
				}
			},reject);
	});
};

service.lockUnlockConsultant=function(id,flag,lockUnlockBy){
	return Q.Promise(function(resolve,reject){

		service.getConsultant(id)
			.then(function(consultant){
				if(consultant && consultant.user){
					userservice.lockunlock(consultant.user,flag,lockUnlockBy)
					.then(function(user){
						resolve({result:true,object:{consultant:consultant,user:user}});
					},reject);
				}
				else if(consultant){
					return resolve({result:false,message:'Consultant not found'});
				}
				else {
					return resolve({result:false,message:'User profile not found'});
				}
			},reject);
	});
}
module.exports = service;