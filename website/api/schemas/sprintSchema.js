var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
  
var sprintSchema = new Schema({
  name:{type:String, default:'Sprint name'},

  description: String,

  createTime:{type: Date, default: Date.now},
  startTime: Date,
  endTime: Date,
  realEndTime: Date,
  
  //sprint state: 0,1,2,3: created, started, pause, finish
  state: { type: Number, default: 0},
  
  deleted : {type: Boolean, default: false},

  backlogs: [{ 
    title:String,
    description: String, 
    estimate : {type: Number, default: 0},
    level: Number,
    tasks: [{ type: ObjectId, ref: 'Task' }]
  }],

  taskState: [{
    title: String,
    index: Number
  }],
  
  tasks: [{ type: ObjectId, ref: 'Task' }],

  history: [{
    type:  { type: Number},
    when:  { type: Date, default: Date.now },
    who:   { type: ObjectId, ref: 'User' }, 
    task:  { type: ObjectId, ref: 'Task' }, //task
    what:  [String]
  }],

  burndown:[{
    date:{type:Date},
    remain:Number
  }]
});

/*
sprintSchema.pre('remove', function(next){
  console.log('message');
    this.model('Project').update(
        {sprints: this._id},  
        {$pull: {sprints: this._id}}, 
        {multi: true},
        next
    );
});
*/

module.exports = mongoose.model('Sprint', sprintSchema);