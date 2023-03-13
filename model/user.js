const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type:String,
        required:true,
        min:6,
        max:255
   },
   email: {
        type:String,
        required:true,
        min:6,
        max:255
   },
   password: {
        type:String,
        required:true,
        min:6,
        max:40
   },
   status:{
       type:String,
       default:'',
       max:20
   },
   location:{
     type:String,
   },
   bio: {
     type:String,
     default:'',
   },
   date: {
        type:Date,
        default:Date.now
   },
   refreshToken: {
        type:String,
        default:null
   },
   
   /*notifications: {
        type:Array,
        default:null
   },
   verified: {
        type: Boolean,
        default: false
   }*/
},{
    timestamps: true
})

module.exports = mongoose.model('User',userSchema)