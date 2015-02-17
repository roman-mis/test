'use strict';
var _=require('lodash');

module.exports={
	getTaskModelMock:function(){
		function TaskModelMock(modelDetail){
			// TaskModelMock.apply(this,modelDetail);
			applyDetails(this,modelDetail);
		}

		TaskModelMock.prototype.save=function(){
			console.log('save called on task model');
		};
			
		TaskModelMock.find=function(){};
		return TaskModelMock;
	},

	getHistoryModelMock:function(){
		function HistoryModelMock(modelDetail){
			applyDetails(this,modelDetail);
		}

		HistoryModelMock.prototype.save=function(){};

		HistoryModelMock.find=function(){};

		return HistoryModelMock;

	},
	getDummyUser:function(){
		return {'_id':'5454543535reebae',firstName:'firstName',lastName:'last name'};
	}	

};

function applyDetails(o,detail){
	_.forEach(detail,function(val,ky){
		o[ky]=val;
	});

	return o;
}