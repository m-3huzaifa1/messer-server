const router = require('express').Router()
const msg = require('../model/message')

router.post('/getConversation', async (req, res) => {
     const { receiverId, senderId } = req.body
  
     try {
     
     const data = await msg.findOne({ receiverId:receiverId, senderId:senderId })
     const data2 = await msg.findOne({ receiverId:senderId, senderId:receiverId })     

     
     if (data === null && data2 !==null) {
          res.status(200).send(data2)
     }
     else {
          if(data2 === null && data !==null) 
          res.status(200).json(data)
          else {
               if ( receiverId === senderId) {
                    res.status(200).json(data)
               }
               else {
                    res.status(200).json("Does not exist")
               }
          }
     }
     } catch(err) {
          res.status(400).json(err)
     }          
})

router.post('/addConversation', async (req, res) => {
     const { receiverId, text, senderId} = req.body
     let messageObj = {
          text,
          senderId,
          Date: Date.now(),

     }
     
     try {
          
          const data = await msg.findOne({ receiverId:receiverId, senderId:senderId })
          const data2 = await msg.findOne({ receiverId:senderId, senderId:receiverId })
          console.log(data,data2)
          if (data === null && data2 === null) {
               
               const newMsg = new msg({
                    receiverId: receiverId,
                    senderId: senderId,
                    message: [messageObj]
               })
               newMsg.save()
               .then( res.status(200).send("Does not exist") )
               
               
          }
          else {
               if(data !== null && data2 === null) {
                    msg.findOneAndUpdate({ receiverId:receiverId, senderId:senderId }, { $push: { message: messageObj } })
                    .then((resp)=>res.status(200).json(resp))
                    .catch(err=>console.log(err))
               }
               else {
                    if(data2 !== null && data === null) {
                         msg.findOneAndUpdate({ receiverId:senderId, senderId:receiverId }, { $push: { message: messageObj } })
                         .then((resp)=>res.status(200).json(resp))
                         .catch(err=>console.log(err))
                    }
                    else {
                    msg.findOneAndUpdate({ receiverId:receiverId, senderId:senderId }, { $push: { message: messageObj } })
                    .then((resp)=>res.status(200).json(resp))
                    .catch(err=>console.log(err))
                    }
               } 
                
               
          }
          } catch(err) {
               res.status(400).json(err)
          }
})

router.post('/delConversation', async (req, res) => {
     const { receiverId, text, senderId, date, sender} = req.body
     let messageObj = {
          text:text,
          senderId:sender,
          Date: date,

     }
     
     try {
          
          const data = await msg.findOne({ receiverId:receiverId, senderId:senderId })
          const data2 = await msg.findOne({ receiverId:senderId, senderId:receiverId })
          console.log(data,data2)
          
          
          if(data !== null && data2 === null) {
                    msg.findOneAndUpdate({ receiverId:receiverId, senderId:senderId }, { $pull: { message: messageObj } })
                    .then((resp)=>res.status(200).json(resp))
                    .catch(err=>console.log(err))
               }
               else {
                    if(data2 !== null && data === null) {
                         msg.findOneAndUpdate({ receiverId:senderId, senderId:receiverId }, { $pull: { message: messageObj } })
                         .then((resp)=>res.status(200).json(resp))
                         .catch(err=>console.log(err))
                    }
                    else {
                    msg.findOneAndUpdate({ receiverId:receiverId, senderId:senderId }, { $pull: { message: messageObj } })
                    .then((resp)=>res.status(200).json(resp))
                    .catch(err=>console.log(err))
                    }
               } 
     }
     catch(err) {
          res.status(400).json(err)
     }
})

module.exports = router