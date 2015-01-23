"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.changeColumn('worker','ni_number'
    	,{type:DataTypes.STRING(13),allowNull:false})
    .complete(done);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done();
  }
};
