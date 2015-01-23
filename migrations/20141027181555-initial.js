"use strict";
var Q=require('q');
module.exports = {
  up: function(migration, DataTypes, done) {
    Q(migration.createTable('users',{
	    id: {
	      type: DataTypes.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	    },
	    title:              {type:DataTypes.STRING(3),allowNull:false},
	    first_name:         {type:DataTypes.STRING(20),allowNull:false},
	    last_name:          {type:DataTypes.STRING(20),allowNull:false},
	    email_address:      {type:DataTypes.STRING(100),allowNull:false},
	    password:           {type:DataTypes.STRING(50),allowNull:true},
	    user_type:          {type:DataTypes.STRING(2),allowNull:false},
	    created_date:       {type:DataTypes.DATE,allowNull:false},
	    updated_date:  {type:DataTypes.DATE,allowNull:true},
	    updated_by: 		{
	    					type:DataTypes.INTEGER,allowNull:true,
	    					references:'users',referenceKey:'id',
        					onUpdate: "CASCADE", onDelete: "SET NULL"
	    				}
  	})
  	)
    .then(function(){
	    return migration.createTable('worker',{
		    id: {
		      type: DataTypes.INTEGER,
		      primaryKey: true,
		      autoIncrement: true
		    },
		    user_id: 		{
		    	type:DataTypes.INTEGER,allowNull:true,
		    	references: "users", referenceKey: "id",
	        	onUpdate: "CASCADE", onDelete: "SET NULL"
		    },
		    contact_number: {type:DataTypes.STRING(15),allowNull:false},
		    ni_number:      {type:DataTypes.STRING(10),allowNull:false},
		    birth_date:     {type:DataTypes.DATE,allowNull:false},
		    address_1: 		{type:DataTypes.STRING(50),allowNull:false},
		    address_2:      {type:DataTypes.STRING(50),allowNull:true},
		    address_3:      {type:DataTypes.STRING(50),allowNull:true},
		    town:           {type:DataTypes.STRING(20),allowNull:false},
		    county:         {type:DataTypes.STRING(20),allowNull:true},
		    post_code:      {type:DataTypes.STRING(10),allowNull:false},
		    gender:         {type:DataTypes.STRING(1),allowNull:false},
		    nationality:    {type:DataTypes.STRING(3),allowNull:false},
		    arrival_date:   {type:DataTypes.DATE,allowNull:true},
		    recent_dep_date:{type:DataTypes.DATE,allowNull:true},
		    emp_last_visit: {type:DataTypes.BOOLEAN,allowNull:true},
		    agency_name:    {type:DataTypes.STRING(50),allowNull:false},
		    job_title:      {type:DataTypes.STRING(50),allowNull:true},
		    start_date:     {type:DataTypes.DATE,allowNull:false},
		    created_date:       {type:DataTypes.DATE,allowNull:false},
		    updated_date:  {type:DataTypes.DATE,allowNull:true},
		    updated_by: 	{
		    					type:DataTypes.INTEGER,allowNull:true,
		    					references:'users',referenceKey:'id',
	        					onUpdate: "CASCADE", onDelete: "SET NULL"
		    				}
	  	});
	})
	.then(function(){

	  	return migration.createTable('worker_bank_detail',{
		    id: {
		      type: DataTypes.INTEGER,
		      primaryKey: true,
		      autoIncrement: true
		    },
		    worker_id: 		{
		    	type:DataTypes.INTEGER,allowNull:true,
		    	references: "worker", referenceKey: "id",
	        	onUpdate: "CASCADE", onDelete: "SET NULL"
		    },
		    bank_name: 		{type:DataTypes.STRING(50),allowNull:false},
	    	account_name:   {type:DataTypes.STRING(50),allowNull:false},
	    	sort_code:      {type:DataTypes.STRING(10),allowNull:false},
	    	account_no:     {type:DataTypes.STRING(15),allowNull:false},
	    	bank_roll_no:   {type:DataTypes.STRING(15),allowNull:true},
		    created_date:       {type:DataTypes.DATE,allowNull:false},
		    updated_date:  {type:DataTypes.DATE,allowNull:true},
		    updated_by: 	{
		    					type:DataTypes.INTEGER,allowNull:true,
		    					references:'users',referenceKey:'id',
	        					onUpdate: "CASCADE", onDelete: "SET NULL"
		    				}
	  	});
  	})
	.then(function(){
	  	return migration.createTable('worker_contact_detail',{
		    id: {
		      type: DataTypes.INTEGER,
		      primaryKey: true,
		      autoIncrement: true
		    },
		    worker_id: 		{
		    	type:DataTypes.INTEGER,allowNull:true,
		    	references: "worker", referenceKey: "id",
	        	onUpdate: "CASCADE", onDelete: "SET NULL"
		    },
		    phone: 			{type:DataTypes.STRING(15),allowNull:true},
		    mobile:      	{type:DataTypes.STRING(50),allowNull:true},
		    alt_email:      {type:DataTypes.STRING(100),allowNull:true},
		    facebook:      	{type:DataTypes.STRING(100),allowNull:true},
		    linkedin:      	{type:DataTypes.STRING(100),allowNull:true},
		    google:      	{type:DataTypes.STRING(100),allowNull:true},
		    created_date:       {type:DataTypes.DATE,allowNull:false},
		    updated_date:  {type:DataTypes.DATE,allowNull:true},
		    updated_by: 	{
		    					type:DataTypes.INTEGER,allowNull:true,
		    					references:'users',referenceKey:'id',
	        					onUpdate: "CASCADE", onDelete: "SET NULL"
		    				}
	  	});
  	})
	.then(function(){

	  	return migration.createTable('worker_tax_detail',{
		    id: {
		      type: DataTypes.INTEGER,
		      primaryKey: true,
		      autoIncrement: true
		    },
		    worker_id: 		{
		    	type:DataTypes.INTEGER,allowNull:true,
		    	references: "worker", referenceKey: "id",
	        	onUpdate: "CASCADE", onDelete: "SET NULL"
		    },
		    current_p45: 	  {type:DataTypes.BOOLEAN,allowNull:false},
		    p45_uploaded:     {type:DataTypes.BOOLEAN,allowNull:false},
		    p46_uploaded:     {type:DataTypes.BOOLEAN,allowNull:false},
		    created_date:       {type:DataTypes.DATE,allowNull:false},
		    updated_date:  {type:DataTypes.DATE,allowNull:true},
		    updated_by: 	{
		    					type:DataTypes.INTEGER,allowNull:true,
		    					references:'users',referenceKey:'id',
	        					onUpdate: "CASCADE", onDelete: "SET NULL"
		    				}
	  	});
  	})
  	.then(function(){done();},
  	function(err){
  		console.log('my migration failed');
  		console.log(err);
  		done(err);
  	});

    // done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    Q(migration.dropTable('worker_tax_detail'))
    .then(function(){
    	return migration.dropTable('worker_contact_detail');	
    })
    .then(function(){
    	 return migration.dropTable('worker_bank_detail');
    })
    .then(function(){
    	return migration.dropTable('worker');	
    })
    .then(function(){
    	return migration.dropTable('users');
    })
    .then(function(){done();},
    	function(err){
    		console.log('my migration error');
    		console.log(err);
    		done(err);
    	});

  }
};
