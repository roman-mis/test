"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('activation_code',{
	    id: {
	      type: DataTypes.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	    },
	    code:         {type:DataTypes.STRING(100),allowNull:false},
    	user_id:          {type:DataTypes.INTEGER,allowNull:true},
	    used_date:           {type:DataTypes.DATE,allowNull:true},
	    created_date:       {type:DataTypes.DATE,allowNull:false},
	    updated_date:  {type:DataTypes.DATE,allowNull:true}
  	}).complete(done);

  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('activation_code')
    .complete(done);
    
  }
};
