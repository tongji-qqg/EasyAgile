var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
  
var userSchema = new Schema({
  name    : { type: String, required: true, unique:true},
  password: { type: String, required: true},
  email   : { type: String, required: true, unique:true},
  emailToken : String,
  tokenVaildUntil : Date,

  regDate: { type: Date, default: Date.now },  
  birthday : { type: Date },
  phone   : String,
  icon    : String,
  iconid  : Number,

  otherAccount:[{
  	platfromName: String,
  	AccountName: String
  }],  

  projects : [{type: ObjectId, ref: 'Project'}],

  files: [{ 
            name: String, 
            url: String,
            createTime: {type:Date,default: Date.now},
            owner: { type: ObjectId, ref: 'User' }
         }],

  messages : [{
      date: { type: Date,default: Date.now },
      from : {type: ObjectId, ref: 'User'},
      message: String,
      read: { type : Boolean, defaule: false}
    }],

  alerts : [{
    date:  { type: Date,default: Date.now },
    from : {type: ObjectId, ref: 'User'},
    message: String,    
    read: { type : Boolean, defaule: false},
    type: {type: Number},
    data: [String]
  }]
});

userSchema.statics.findUserByEmail = function(email, callback) {

    return this.model('User').find( {email: email}, callback );
}

module.exports = mongoose.model('User',userSchema);