var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var topicSchema = new Schema({
  title:  { type: String, required: true, default: "title"},
  author: { type: ObjectId, ref: 'User' },

  body:   String,
  date: { type: Date, default: Date.now },

  comments: [{    //assume comment no more than 100 so that return time less than 0.1s
    id: int,
    body: String, 
    date: { type: Date, default: Date.now },
    owner: { type: ObjectId, ref: 'User' },
  }],
   
  deleted: {type: Boolean, default: false}, // may be use, may be not
});