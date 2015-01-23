"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn('worker_tax_detail','p45_document_url'
    	,{type:DataTypes.STRING(500),allowNull:true})
    .complete(done);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.removeColumn('worker_tax_detail','p45_document_url')
    .complete(done);
  }
};
