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

  backlogs: [{ description: String, level: Number }],

  taskTotal: { type: Number, default: 0},
  taskFinish: { type: Number, default: 0},

  taskState: [{
    title: String,
    index: Number
  }],
  
  tasks: [{ type: ObjectId, ref: 'Task' }]
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