'use strict';

var Q=require('q');
var _=require('lodash');

module.exports=function(){
	return {
		applySearch:function(q,Model,request){


			// var q=Model.find();
			return Q.Promise(function(resolve,reject){

				var pagination=request.pagination||{limit:1000000,offset:0};

				var orders=request.orderBy||{};

				_.forEach(request.filters,function(filter,filterName){



					// var filterObj={};

						if(filter.operator==='exact' ||filter.operator==='equals' ){
							 q.where(filterName).equals(filter.term);
						}
						else if(filter.operator==='contains' ){
							q.where(filterName).equals(new RegExp(filter.term,'i'));
						}
						else if(filter.operator==='ne' ){

							q.where(filterName).ne(filter.term);
						}
						else if(filter.operator==='between' ){
							var dates = filter.term.split('|');
							var start = (isNaN(dates[0])?new Date(dates[0]):Number(dates[0]));
							var end = (isNaN(dates[1])?new Date(dates[1]):Number(dates[1]));
							q.where(filterName)
							.gt(start)
							.lt(end);
						}
				});


				Q.nfcall(q.count.bind(q))
					.then(function(totalcount){


						q=q.find();
						q.limit(pagination.limit);
						q.skip(pagination.offset);

						_.forEach(orders,function(order){
							q.sort(order);

						});

						Q.nfcall(q.exec.bind(q))
							.then(function(allRecords){
								console.log(allRecords);

								// console.log(allRecords);


								resolve({count:totalcount,rows:allRecords});

							},reject);
					},reject);

			});

		},
		search:function(){
			// return Q.Promise(function(resolve,reject){
			// 	var opt=option||{};
			// 	var filters =opt.filters||[];
			// 	var select=opt.select||'';
			// 	var pagination=opt.pagination||{limit:1000000000,offset:0};
			// 	var orderBy=opt.orderBy||{};

			// 	var model=conn.DB.model(modelName);
			// 	var query=model.find();

			// 	_.forEach(populatedModels,function(val,ky){
			// 		query.populate(val);
			// 	});
			// 	if(select && select.trim()!=''){
			// 		query.select(select);
			// 	}

			// 	applyFilters(filters,query,model)
			// 		.then(function(){
			// 			Q.nfcall(query.exec.bind(query))
			// 				.then(function(allRecords){
			// 					resolve({rows:allRecords,count:allRecords.length});
			// 				});
			// 		},reject);

			// });
		}
	};

	// function applyFilters(filters,query,model){
	// 	return Q.Promise(function(resolve){
	// 		var allPromisedFilters=_.map(filters,function(filterItem,ky){
	// 		return findFilter(ky,filterItem,model);
	// 		// return Q.Promise(function(resolve,reject){

	// 		// });

	// 		});

	// 		if(allPromisedFilters.length>0) {
	// 			var newP=allPromisedFilters[0];

	// 			for(var i=1;i<allPromisedFilters.length;i++) {
	// 				newP=newP
	// 				.then(allPromisedFilters[i].then(function(r){
	// 					applyFilter(query,r,{});
	// 					return true;
	// 				}));
	// 			}

	// 			newP.then(function(){
	// 				resolve(query);
	// 			});
	// 		}
	// 		else{
	// 			resolve(query);
	// 		}

	// 	});

	// }



	// function findFilter(filterName,filter,model){
	// 	return Q.Promise(function(resolve,reject){
	// 		var prop=model.schema.paths[filterName];

	// 		var newFilters=filterName.split('.');
	// 		if(prop!==undefined && prop.options && (prop.options.type===String||prop.options.type===Number||prop.options.type===Date||prop.options.type===Boolean) ){
	// 			resolve({key:filterName,operator:filter.operator,term:filter.term});

	// 			// var filterItem=filter.val;
	// 			// var operator=filterItem.operator.toLowerCase();
	// 			// if(operator==='exact'||operator==='iexact'||operator==='equals')
	// 			// {
	// 			// 	query.where(filter.key).equals(filterItem.term);
	// 			// }
	// 			// else if(operator==='gt'){
	// 			// 	query.where(filter.key).gt(filterItem.term);
	// 			// }


	// 			// resolve()
	// 		}
	// 		else if(newFilters.length>1){
	// 			//if (prop!==undefined && prop.schema && prop.schema.paths){
	// 				var a=filterName;
	// 			for(var i=0;i<newFilters.length;i++){
	// 				a=filterName.substring(0,_.lastIndexOf(a,'.'));
	// 				var b=filterName.substring(_.lastIndexOf(a,'.')+1);

	// 				prop=newFilters.model.schema.paths[a];
	// 				if(prop!==undefined && prop.caster){
	// 					var newModel=conn.DB.model(a);
	// 					findFilter(b,filter,newModel,{},[])
	// 						.then(function(r){
	// 							var newQ=model.find();
	// 							newQ=applyFilter(newQ,r,{select:'_id'});
	// 							Q.nfcall(newQ.exec.bind(newQ))
	// 								.then(function(ids){
	// 									resolve({key:a,operator:'in',term:ids});
	// 								},reject);

	// 						},reject);
	// 					break;
	// 				}
	// 			}
	// 			// prop=model.schema.paths[filterName];

	// 			// if(prop.schema){//prop with

	// 			// }
	// 			// var newFilterName=_.remove(newFilters,function(itm,idx){return idx>0}).join();

	// 		}
	// 	});
	// }

	// function applyFilter(query,filter,option){
	// 	if(filter && filter.key){
	// 		query=query.where(r.key);
	// 		if(filter.operator==='exact'||filter.operator==='iexact'||filter.operator==='contains'||filter.operator==='equals')
	// 		{
	// 			query=query.equals(r.term);
	// 		}
	// 		else if(filter.operator==='gt'){
	// 			query.where(filter.key).gt(filter.term);
	// 		}
	// 		else if(filter.operator==='lt'){
	// 			query=query.where(filter.key).lt(filter.term);
	// 		}
	// 		else if(filter.operator==='in'){
	// 			query=query.where(filter.key).in(filter.term);
	// 		}

	// 	}

	// 	if(option && option.select){
	// 		query.select(select);
	// 	}

	// 	return query;
	// }

	// function traverseFilter(){

	// }

	// function goDeepSchema(model,filterName,filter){
	// 	return Q.Promise(function(){
	// 		// var newFilters=filterName.split('.');

	// 	});
	// }


};


