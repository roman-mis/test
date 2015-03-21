'use strict';
var _=require('lodash');

module.exports=function(db){

	function includeModel(allIncludes,db,inc,parentInc){
		var modelName=inc;
		var subModelIndex=-1;
		subModelIndex =inc.indexOf('.');
		if(subModelIndex>=0){
			modelName=inc.substr(0,subModelIndex);	
		}
		var myModel;
		if(parentInc){
			myModel=hasThisModel(parentInc.include,modelName);
		}
		else{
			myModel=hasThisModel(allIncludes,modelName);
		}
		//console.log('including : '+modelName);
		// var myModelInc;

		if(!myModel){
			myModel=_.find(db.sequelize.models,function(itm){
				var ky=itm.name;
				//console.log(db.sequelize.models[ky]);
				// var itm=db[ky]
				//console.log(typeof ky);
				 if(ky.toLowerCase ){
				 	//console.log('has toLowerCase');
				 	//console.log(ky);
				 	if(ky.toLowerCase()===modelName.toLowerCase()){
				 		return true;	
				 	}
					
				 }

				return false;
			});
					
			// console.log(myModel);
			if(myModel){
				myModel={model:myModel};
				//console.log('adding : '+modelName);
				//console.log('found');
				
				if(parentInc){
					parentInc.include=parentInc.include||[];

					parentInc.include.push(myModel);
				}
				else{
					allIncludes.push(myModel);	
				}
				
			}
		}
		else{
			// myModelInc={model:myModel};
		}

		if(myModel && subModelIndex>=0){
			//console.log('going for sub key');
			var subModelKey=inc.substr(subModelIndex+1,inc.length-1-modelName.length);
			includeModel(allIncludes,db,subModelKey,myModel);
		}
	}

	function hasThisModel(allIncludes,modelName){
		// console.log(allIncludes);
		var allFlattened=_.flatten(allIncludes);
		// console.log('all flattened');
		// console.log(allFlattened);

		var existingModel=_.find(allFlattened,function(model){
			if(model){
				var ky=model.model.name;
				// console.log(ky);
				if(ky.toLowerCase()===modelName.toLowerCase()){
					return true;
				}
			}

			return false;
		});
		
		return existingModel;
	}
	
	return function(req,res,next){
		console.log('testtest');
		var opt={
			include:[],
			filterBy:{},
			sortBy:{}
		};
		console.log(opt);
		if(req.query._include){
			console.log('1');
			var includes=_.map(req.query._include.split(','),
				function(el){
				if(el){
					// console.log(el);
					return el.trim();
				}
				else{
					return '';
				}
			})
			;

			var allIncludes=[];
			//console.log('here i am');
			//console.log(typeof db.sequelize.models.ActivationCode);
			includes.forEach(function(inc){

				includeModel(allIncludes,db,inc);

				
			});
			
			opt.include=allIncludes;
			// console.log('all includes');
			// console.log(allIncludes);
		}

		if(!_.isUndefined(req.query._limit) || !_.isUndefined(req.query._offset)){
			console.log('2');
			var paginationOption={};	
			paginationOption.limit=req.query._limit?req.query._limit:20;
			paginationOption.offset=req.query._offset?req.query._offset:0;
			opt.pagination=paginationOption;
		}

		if(req.query._orderby){
			console.log('3');
			//var allOrderBys=[];
			var orderBys=_.map(req.query._orderby.split(','),
				function(itm){

					if(itm){
						var orderItem={};
						var orderName=itm.replace('-','');
						// orderItem.push(orderName);
						var order=(itm.substr(0,1)==='-'?'desc':'asc');
						orderItem[orderName]=order;
						
						return orderItem;	
					}

					return undefined;
					
				});

			opt.orderBy=orderBys;
	
		}

		var filters={};

		_.forEach(req.query,function(v,q){

			// console.log('q = ');
			if(q && v && q.substr(0,1)!=='_'){
				var filter={};

				var filterName=q;
				var operator='exact';
				//console.log('checking '+q.toLowerCase());
				_.forEach(['exact','iexact','contains','icontains', 'between'],function(itm){
					//console.log('validating with  '+itm);
					if(q.toLowerCase().indexOf('_'+itm)>=0){
						//console.log('looks like valid ');
						filterName=q.replace('_'+itm,'');
						operator =itm;
						return false;
					}
				});

				filter={term:v,operator:operator};

				filters[filterName]=filter;
			}
		});
		opt.filters=filters;
		console.log(opt);
		
		// if(filters){
		// 	var reqFilters={};
		// 	_.forEach(filters,function(itm,idx){
		// 		if(req.query[itm]){
		// 			reqFilters[itm]=req.query[itm];
		// 		}
		// 	});
		// }

		req._restOptions=opt;
		
		//res.json(opt);
		next();
	};


};