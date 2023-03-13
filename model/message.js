const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
     senderId:{
          type:String,
          required:true
     }, 
     receiverId: {
          type:String,
          required:true
     },
     message: {
          type:JSON,
          required:true
     },     
      date: {
           type:Date,
           default:Date.now()
      }
},{timestamps: true});

module.exports = mongoose.model('Message',messageSchema);