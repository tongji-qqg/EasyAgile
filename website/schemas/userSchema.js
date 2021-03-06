var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
  
var userSchema = new Schema({
  name    : { type: String, required: true},
  password: String,
  email   : { type: String, required: true, unique:true},

  regDate: { type: Date, default: Date.now },  
  birthdate : { type: Date },
  phone   : String,
  icon    : String,

  otherAccount:[{
  	platfromName: String,
  	AccountName: String
  }],

  projects : [{ 
  	projectName:String,  	
  	projectstartDate: Date,
  	project{ type: ObjectId, ref: 'Project' }
  }]
});
