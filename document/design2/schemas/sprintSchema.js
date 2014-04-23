var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
  
var sprintSchema = new Schema({
  startTime: Date,
  endTime: Date,
  realEndTime: Date,
  description: String,
  done: { type: Boolean, default: false},

  backlogs: [{ id:int, description: String, level: int }],

  defects: [{ id:int, description:String, level:int }],

  issues: [{ 
    id:int, 
    description:String, 
    level:int, 
    discoverTime: { type: Date, default: Date.now },
    discoverPerson: { name: String, id: ObjectId },   //dont need change when user name change    
    solved: { type: Boolean, default:false },
  }],

  tasks: [{
    id: int,
    description: String,
    deadline: Date,
    finishTime: Date,
    done: { type: Boolean, default: false },
    progess: { type: int, default: 0 } //0~100,0%~100%  
    //assume asign task to member no more than 200, so can return less than 0.2s      
    executer: [{ type: ObjectId, ref: 'User' }]  
  }]
});
