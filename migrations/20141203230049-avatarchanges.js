"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn('users','avatar_file_name',{
    	type:DataTypes.STRING(200),
    	allowNull:true
    }).complete(done);
    
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
     migration.removeColumn('users','avatar_file_name')
    .complete(done);
  }
};
