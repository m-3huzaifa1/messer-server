const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const Server = http.createServer(app)
const dotenv = require('dotenv')

const port = process.env.PORT || 8080

const connectDB = require('./config/db')
const authRoute = require('./routes/user')
const refreshRoute = require('./routes/refresh')
const corsOptions = require('./config/cors')
const messageRoute = require('./routes/message')
const credentials = require('./middleware/credentials')

dotenv.config()
connectDB()

app.use(credentials)
app.use(morgan('dev'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())

app.use('/api/auth',authRoute)
app.use('/api/refresh',refreshRoute)
app.use('/api/message',messageRoute)

app.get('/',(req,res)=>{
    res.send('Server Running')
})

// Socket

const io = require('socket.io')(Server , {
    cors: {
      origin: [ 'http://localhost:3000'] ,
      methods: ["GET", "POST"],
      credentials: true
  },
//  pingInterval: 10000,
//  pingTimeout: 5000,
//  path: '/socket.io'
});

let users = [];
const addUser = (userId,socketId)  =>{
    console.log('in adduser',users);
    !users.some(user=> user.userId==userId) && users.push({userId,socketId});

    console.log('in add user' , users);
}

const getUser = (userId) => {
    console.log(users,userId);
      return users.find(user=> user.userId === userId);
}

const removeUser = (id)=>{
    users.filter(user=> user.sockedId!=id)
}
//connect
io.on('connection', (socket) =>{
    console.log(`User connection successful - ${socket.id}`);

    socket.on('addUser',(userId)=>{
        console.log('inside adduser');
        addUser(userId,socket.id);
        
        io.emit('getUsers',users);
    });

    //send message
    socket.on('sendMessage', ({senderId , recieverId, text, Date})=> {
       
        const user = getUser(recieverId);
        console.log(text,user);
        // user  &&
        io.emit('getMessage',{
            senderId,text,Date,targetId: recieverId
        })
    });

    //disconnect
    socket.on('disconnect',()=>{
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers',users);
    })
})


Server.listen(port,()=>{console.log(`Server Running on port ${port}`)})
