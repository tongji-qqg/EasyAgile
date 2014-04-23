var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var projectSchema = new Schema({
  name : { type: String, required: true, default: "project" },
  description: String,
  startTime: { type: Date, default: Date.now },
  endTime: Date
  realEndTime: Date

  owner: { 
    name: String,   //change when user change
    id: ObjectId, 
    icon: String,   //change when user change
    required: true 
  },
  members: [{ 
    name: String,   //change when user change
    id: ObjectId, 
    icon: String,   //change when user change
    isAdmin: { type: Boolean, default: false } 
  }],
  
  releases: [{ id:int, editTime:Date, releaseTime: Date, description: String, realReleaseTime: Date }],

  topics: [{ type: ObjectId, ref: 'Topic' }],

  requirements: [{ id:int, description: String, level: int}],  //level priority level

  files: [{ 
            id:int,
            name: String, 
            uploadTime: {type:Date,default: Date.now},
            owner: { type: ObjectId, ref: 'User' }
         }],
         
  sprints: [{ type: ObjectId, ref: 'Sprint' }] //assume no more than 100 sprints, so can return less than 0.1s
});