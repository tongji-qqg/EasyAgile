var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var projectSchema = new Schema({
  name : { type: String, required: true, default: "project" },
  description: String,
  createTime: { type: Date, default: Date.now },
  endTime: Date,
  realEndTime: Date,
  done: {type: Boolean, default:false},
  deleted : {type: Boolean, default: false},
  owner: { type: ObjectId, ref: 'User'},     
  ownerGroup :String,
  members: [{ 
    name: String,   //change when user change
    _id: ObjectId,
    ref: { type: ObjectId, ref: 'User' },
    icon: String,   //change when user change
    isAdmin: { type: Boolean, default: false },
    group:String 
  }],
  
  groups: [String],
  //releases: [{ editTime:Date, releaseTime: Date, description: String, realReleaseTime: Date }],

  topics: [{ type: ObjectId, ref: 'Topic' }],

  requirements: [{ description: String, level: Number}],  //level priority level

  issues: [{ 
    description:String, 
    level:Number, 
    finder: { type: ObjectId, ref: 'User' },
    dealer: { type: ObjectId, ref: 'User' },
    discoverTime: { type: Date, default: Date.now },      
    solved: { type: Boolean, default:false },
  }],
  
  files: [{ 
            name: String, 
            path: String,
            size: Number,
            createTime: {type:Date,default: Date.now},
            owner: { type: ObjectId, ref: 'User' }
         }],

  editor:[{
    type: {type:Number, default:0}, //0 is doc, 1 is src, more type not define
    name: String,    
    path: String,
    createTime: {type:Date,default:Date.now},    
  }],
  

  cSprint: { type: ObjectId, ref: 'Sprint' },
  sprints: [{ type: ObjectId, ref: 'Sprint' }] //assume no more than 100 sprints, so can return less than 0.1s
});




module.exports = mongoose.model('Project', projectSchema);