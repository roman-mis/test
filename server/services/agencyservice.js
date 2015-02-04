// 'use strict';

var db = require('../models'),
	Q=require('q'),
	_=require('lodash'),
	uuid = require('node-uuid'),
	utils=require('../utils/utils'),
	queryutils=require('../utils/queryutils')(db),
	awsservice=require('../services/awsservice'),
	userservice=require('../services/userservice'),
	candidatecommonservice=require('../services/candidatecommonservice');

var service={};

service.getAllAgencies=function(request){
	return Q.Promise(function(resolve,reject){
		var q=db.Agency.find().populate('branches');
		
		queryutils.applySearch(q,db.Agency,request)
		.then(resolve,reject);
	});
};

service.saveAgency = function(agencyDetails, agencyId){
	console.log('saveAgency');
	return Q.Promise(function(resolve,reject){	
		var agency;
		if(agencyId === null){
			// Add Agency
			agency = new db.Agency(agencyDetails);

			var branch =new db.Branch({
				name: 				 'Head Office',
			    address1:            agencyDetails.address1,
			    address2:            agencyDetails.address2,
			    address3:            agencyDetails.address3,
				town:                agencyDetails.town,
			    postCode:            agencyDetails.postCode,
			    branchType:          'HQ',
			});

			agency.branches.push(branch._id);
			branch.agency=agency._id;
			console.log('saving');
			return Q.all([Q.nfcall(agency.save.bind(agency)),Q.nfcall(branch.save.bind(branch))])
			.then(function(){
					console.log('save done');
					resolve({agency:agency,branch:branch});
				},reject);
		}else{
			// Update Agency
			return Q.all([service.getAgency(agencyId),service.getBranches([{'agency':agencyId},{'branchType':'HQ'}])])
				.spread(function(agency,branches){
					var previousLogoFile=agency.logoFileName;
					utils.updateSubModel(agency, agencyDetails);
					var branch;
					console.log('about to save agency');
					console.log(agency);
					return Q.nfcall(agency.save.bind(agency))
						.then(function(){
							if(branches && branches.length>0){
								branch=branches[0];
								var branchDetails = {
										address1:            agencyDetails.address1,
									    address2:            agencyDetails.address2,
									    address3:            agencyDetails.address3,
										town:                agencyDetails.town,
									    postCode:            agencyDetails.postCode
									};
									console.log('about to save branch');
								utils.updateSubModel(branch, branchDetails);
								return Q.nfcall(branch.save.bind(branch))
									.then(function(){
										console.log('branch saved');
										return removePreviousLogo();
									});
							}

							return true;
							
						})
						.then(function(){
							console.log('all done');
							resolve({agency:agency,branch:branch});
						},reject);
					
				},reject);

				function removePreviousLogo(){
					console.log('removing previous logo');
					if(agencyDetails.logoFileName && agencyDetails.logoFileName.trim()!='' && previousLogoFile && previousLogoFile.trim()!='' && (previousLogoFile.trim().toLowerCase()!=agencyDetails.logoFileName.trim().toLowerCase())){
								console.log('removing previous logo');
								var folder=process.env.S3_AGENCY_FOLDER+agency._id+'/';
							 	return awsservice.deleteS3Object(previousLogoFile,folder);
						}
					return true;
				}
		}
	});
};

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
};

service.getAgency=function(id, populate){
	populate = typeof populate !== 'undefined' ? populate : false;
	var q=db.Agency.findById(id)
	.populate('defaultInvoicing.invoiceDesign');
	
	if(populate){
		console.log('populate with invoiceTo');
		q.populate('branches').populate('defaultInvoicing.invoiceTo');
	}
	
	return Q.nfcall(q.exec.bind(q));
};

// service.getAgencyByBranchId=function(id){
// 	var q=db.Agency.findOne({'branches._id':id}).populate('branches.consultants.user');
// 	return Q.nfcall(q.exec.bind(q));
// }

// service.getAgencyByConsultantId=function(id){
// 	var q=db.Agency.findOne({'branches.consultants._id':id}).populate('branches.consultants.user');
// 	return Q.nfcall(q.exec.bind(q));
// }

service.getConsultants=function(branchId){
	var q=db.Consultant.find({'branch':branchId}).populate('agency').populate('branch').populate('user');
	return Q.nfcall(q.exec.bind(q));

};

service.getConsultant=function(id){
	return Q.Promise(function(resolve,reject){
		var q=db.Consultant.findById(id).populate('agency').populate('branch').populate('user');
			return Q.nfcall(q.exec.bind(q)).then(function(consultant){
				
				resolve(consultant);

			},reject);
	});
};

service.getUserByConsultantId=function(id){
	return Q.Promise(function(resolve,reject){
		service.getConsultant(id)
		.then(function(consultant){
			if(consultant && consultant.user && consultant.user._id){
				userservice.getUser(consultant.user._id)
				.then(function(user){
					resolve(user);
				},reject);
			}else{
				resolve();
			}
		},reject);
	});
};


service.postBranch=function(agencyId, branchInfo){
	return Q.Promise(function(resolve,reject){
		service.getAgency(agencyId)
			.then(function(agency){
				if(agency){
					// Add
					var branch=new db.Branch(branchInfo);
					branch.agency=agency._id;
					agency.branches.push(branch._id);
					Q.all([Q.nfcall(agency.save.bind(agency)),Q.nfcall(branch.save.bind(branch))])
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
		service.getBranch(branchId)
			.then(function(branch){
				//if(agency){
					// Update
					//var branch = agency.branches.id(branchId);
					if(branch){
						utils.updateSubModel(branch, branchInfo);
						Q.nfcall(branch.save.bind(branch))
						.then(function(){
							resolve({result:true, object:{agency:branch.agency, branch: branch}});
						},reject);
					} else{
						reject({result:false,name:'NOTFOUND',message:'Branch not found'});
					}
				// }else{
				// 	reject({result:false,name:'NOTFOUND',message:'Agency not found'});
				// }
			},reject);
	});
};

service.getBranch=function(branchId){
	var query=db.Branch.findOne({'_id':branchId}).populate('agency');
	return Q.Promise(function(resolve,reject){
		Q.nfcall(query.exec.bind(query))
			.then(function(branch){
				// console.log(agency);
				if(branch){
					//var agency=branch.agency;
					resolve(branch);
				}
				else{
					reject(null);
				}
			},reject);
	});
};

service.getBranches=function(filter,populate){
	console.log('about to getBranches');
	populate=(populate||'consultants');
	populate=Array.isArray(populate)?populate:[populate];

	filter=(filter||{});
	filter=Array.isArray(filter)?filter:[filter];

	var q=db.Branch.find();

	_.forEach(filter,function(f,idx){
		q.where(f);
	});
	_.forEach(populate,function(p,idx){
		q.populate(p);
	});
	// console.log('filters');
	// console.log(filter);
	// console.log('populate');console.log(populate);
	return Q.nfcall(q.exec.bind(q));

};

service.deleteBranch=function(branchId){
	return Q.Promise(function(resolve,reject){
		return service.getBranch(branchId)
			.then(function(branch){
				
					if(branch){
						// Get Index
						
						return Q.nfcall(branch.remove.bind(branch))
							.then(function(){
								service.getAgency(branch.agency)
									.then(function(agency){
										
										var index = agency.branches.indexOf(branchId);
										
										if(index>=0){
											
											agency.branches.splice(index, 1);
										}
										
										return Q.nfcall(agency.save.bind(agency))
											.then(function(){
												console.log('removing branch 5');
												resolve({result:true});
											},reject);
									});
								
								
							},reject);
					}else{
						reject({result:false,name:'NOTFOUND',message:'Branch not found'});
					}
				
			},reject);
	});
};

service.postConsultant=function(branchId, consultantInfo){
	return Q.Promise(function(resolve,reject){
		return service.getBranch(branchId)
				.then(function(branch){
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
							};
							
							return userservice.createUser(opt, newUser).then(function(user){
								// Add
								console.log('user created');
								consultantInfo.user = user.object._id;
								var consultant = new db.Consultant(consultantInfo);
								consultant.branch=branch._id;
								consultant.agency=branch.agency;
								branch.consultants.push(consultant._id);
								
								return Q.all([Q.nfcall(consultant.save.bind(consultant)),Q.nfcall(branch.save.bind(branch))])
								.then(function(){
									resolve({result:true,object:{branch:branch, consultant:consultant, user: user}});
								},reject);

								
							},reject);
						} else{
							reject({result:false,name:'NOTFOUND',message:'Branch not found'});
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
					
					if(consultantInfo.emailAddress && consultantInfo.emailAddress!==consultant.emailAddress){
						//check duplicate email address.
						console.log('checking duplicate user');
						userservice.checkDuplicateUser(consultantInfo.emailAddress,{_id:consultant.user._id})
							.then(function(){
								updateConsultant(agency,consultant)
									.then(function(result){
										resolve({result:true,object:{agency:agency, branch:branch, consultant:result.object.consultant,user:result.object.user}});
									},reject);
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
};

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
		return service.getConsultant(consultantId)
					.then(function(consultant){
						if(consultant){
							return userservice.removeUser(consultant.user._id)
								.then(function(response){
									// Get Index
									var branch=consultant.branch;
									var index = branch.consultants.indexOf(consultant);
									branch.consultants.splice(index, 1);

									return Q.nfcall(branch.save.bind(branch))
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
					console.log(agency.defaultInvoicing);
					// Default Payroll
					utils.updateSubModel(agency.defaultPayroll, defaultPayrollDetails); // Edit
					console.log('here');
					Q.nfcall(agency.save.bind(agency))
					.then(function(){
						console.log('here');

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
					userservice.lockunlock(consultant.user._id,flag,lockUnlockBy)
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
};
module.exports = service;