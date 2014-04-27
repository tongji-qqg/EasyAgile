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

  owner: { 
    name: String,   //change when user change
    _id: ObjectId, 
    icon: String,   //change when user change    
  },
  members: [{ 
    name: String,   //change when user change
    _id: ObjectId, 
    icon: String,   //change when user change
    isAdmin: { type: Boolean, default: false } 
  }],
  
  releases: [{ editTime:Date, releaseTime: Date, description: String, realReleaseTime: Date }],

  topics: [{ type: ObjectId, ref: 'Topic' }],

  requirements: [{ description: String, level: Number}],  //level priority level

  files: [{ 
            id:Number,
            name: String, 
            url: String,
            uploadTime: {type:Date,default: Date.now},
            owner: { type: ObjectId, ref: 'User' }
         }],
         
  sprints: [{ type: ObjectId, ref: 'Sprint' }] //assume no more than 100 sprints, so can return less than 0.1s
});




module.exports = mongoose.model('Project', projectSchema);