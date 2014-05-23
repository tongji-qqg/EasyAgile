var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var taskSchema = new Schema({
  
  createTime:{type: Date, default: Date.now},

  creator: { type: ObjectId, ref: 'User' },

  title : { type: String, required: true },

  description: String,

  startTime: Date,
  deadline: Date,  
  realEndTime: Date,
  
  state: { type: Number, default: 0},    
  type: {type:Number, default:0 },
  level:Number,
  estimate: {type: Number, default: 0},

  progress: { type: Number, default: 0 }, //0~100,0%~100%  

  executer: [{ type: ObjectId, ref: 'User' }],

  comments: [{    //assume comment no more than 100 so that return time less than 0.1s
    body: String, 
    date: { type: Date, default: Date.now },
    owner: { type: ObjectId, ref: 'User' },
  }],  

  history: [{
  	when:  { type: Date, default: Date.now },
  	who: { type: ObjectId, ref: 'User' },  	
  	what: String
  }],
});

module.exports = mongoose.model('Task', taskSchema);