var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
  
var sprintSchema = new Schema({
  name:{type:String, default:'Sprint name'},
  createTime:{type: Date, default: Date.now},
  startTime: Date,
  endTime: Date,
  realEndTime: Date,
  description: String,
  state: { type: Number, default: 0},
  deleted : {type: Boolean, default: false},

  backlogs: [{ description: String, level: Number }],

  defects: [{ description:String, level:Number }],

  issues: [{ 
    description:String, 
    level:Number, 
    discoverTime: { type: Date, default: Date.now },      
    solved: { type: Boolean, default:false },
  }],

  tasks: [{
    description: String,
    deadline: Date,
    finishTime: Date,
    level:Number,
    state: { type: Number, default: 0 },
    progress: { type: Number, default: 0 }, //0~100,0%~100%  
    //assume asign task to member no more than 200, so can return less than 0.2s      
    executer: [{ type: ObjectId, ref: 'User' }]  
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