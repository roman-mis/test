'use strict';
var _=require('lodash');
var bcrypt=require('bcryptjs'),
 Q=require('q'),
 path=require('path'),
 fs=require('fs');
//var db=require('../models');

var utils;

module.exports=utils={
	findInArray:function(arr,key,keyName){
		var foundValue=_.find(arr,function(val){
			if(_.isObject(val)){
				// console.log(val);
				return (val[keyName]+'').toString().toLowerCase()===(key||'').toString().toLowerCase();
			}
			return val.toLowerCase()===key.toLowerCase();
		});

		return foundValue;
	},
	parseEnumValue:function(enumObj,key){
		var foundValue=_.find(enumObj,function(val,ky){

			return key.toLowerCase()===ky.toLowerCase();
		});

		return foundValue;

	},
	nullifyDate:function(dateValue){
		if(dateValue){
			return (_.isEmpty(dateValue)?null:dateValue);
		}

		return null;
	},
	secureString:function(unsecureString){
		var deff=Q.defer();
		bcrypt.genSalt(10, function(err, salt) {
			if(err){
				deff.reject(err);
			}
			else{
			    bcrypt.hash(unsecureString, salt, function(err, hash) {
			        if(err){
			        	deff.reject(err);

			        }
			        else{
			        	deff.resolve(hash);
			        }
			    });
			}
		});

		return deff.promise;

	},
	compareSecureString:function(secureString,plainString){
		var deff=Q.defer();
		bcrypt.compare(plainString,secureString,function(err,testResult){
                    
			deff.resolve(testResult);
        });

		return deff.promise;

	},
	updateModel:function(model,viewmodel){
		var props=[];
		_.forEach(viewmodel,function(val,key){
					
					if(val!==undefined){
						model[key]=val;
						props.push(key);
					}
				});
		return props;
	},
	updateSubModel:function(model,viewmodel){
		console.log(model);
		console.log(viewmodel);
		var props=[];
		model=model||{};
		_.forEach(viewmodel,function(val,key){
					if(val!==undefined && key!=='_id'){
						model[key]=val;
						props.push(key);
					}
				});
		return props;
	},
	filter:function(filters,modelOptions){
		_.forEach(filters,function(filter,filterName){
			console.log('=======================================================');
			console.log('searching for '+filterName+' = '+JSON.stringify(filter));
			_.forEach(modelOptions,function(itm){
				var option=itm.option,model=itm.model;
				console.log('---------------------------------------------------');
				console.log('In Table '+model.tableName +' with these attributes '+JSON.stringify(_.keys(model.tableAttributes)));
				if(_.indexOf(_.keys(model.tableAttributes),filterName)>=0){
					console.log(' and found ');
					var filterText=filterName + ' ';
					if(filter.operator==='exact' ){
						filterText+=' = ? ';
					}
					else if(filter.operator==='contains' ){
						filterText+=' like ? ';
					}

					option.where[0]=option.where[0] + (option.where[0]!=='' ?' and ' : ' ') + filterText;
					var filterValues=(filter.operator==='contains'? '%'+filter.term+'%':filter.term);
					option.where.push(filterValues);
					return false;
				}
			});
		});
	},
	padLeft:function(nr, n, str){
	    return new Array(n-String(nr).length+1).join(str||'0')+nr||'0';
	},
	createDirectory:function(path){
		return Q.Promise(function(resolve,reject){
			console.log('createDirectory  : '+path);
			fs.exists(path,function(exists){
				if(exists){
					resolve();
				}
				else{
					console.log('making dir  : '+path);
					fs.mkdir(path,function(err){
						console.log('making dir complete ');
						if(err){
							reject(err);
						}
						else{
							resolve();
						}
					});
				}
			});
		});
		
	},
	receiveFileStream:function(sourceStream,destinationFilePath){
		return Q.Promise(function(resolve,reject){
			var tempDir=path.dirname(destinationFilePath);
			console.log('receiveFileStream : '+destinationFilePath);
			utils.createDirectory(tempDir)
				.then(function(){
					console.log('copying stream');
					var fstream=fs.createWriteStream(destinationFilePath);
				    sourceStream.pipe(fstream);
				    fstream.on('close',resolve)
				    .on('error',reject);
			},reject);
		});
	},
	receiveFile:function(fieldName,file,filename){
		return Q.Promise(function(resolve,reject){
			var tempDir=path.join(__dirname+'/..',process.env.TEMP_DIR||'/temp/');

			console.log('Receiving file : '+ filename);
			
			var filePath=path.join(tempDir,filename);
			utils.receiveFileStream(file,filePath)
			.then(function(){
				resolve(filePath);
			},reject);
			
		     	
		    });

	},
	sendFileData:function(res,data){
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
	},
	readCsvFromFile: function(filePath){
		var csv = require('fast-csv');
		return Q.Promise(function(resolve){
			var csvData = [], header=[], headerFlag=false;
			csv
			 .fromPath(filePath)
			 .on('data', function(data){
				if(!headerFlag){
					header = data; console.log(header);
					headerFlag = true;
				}else{
					var record = {};
					data.forEach(function(value, index){
						if(header[index] !== ''){
							// Converting to Camel Case
							var headerName = header[index]
								.toLowerCase()
								.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
						        .replace(/\s/g, '')
						        .replace(/^(.)/, function($1) { return $1.toLowerCase(); }); 
							record[headerName] = value.replace(/"/g, '') || null;
						}
					});
					csvData.push(record);
				}
			 }).on('end', function(){
			     resolve(csvData);
			 });
		});
	},
	camelize: function(randomString){
		return randomString
	        .toLowerCase()
	        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
	        .replace(/\s/g, '')
	        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
	}
};
