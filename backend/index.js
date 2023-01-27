import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import router from './routes/message.js'
import message from './models/message.js'


const url = "mongodb+srv://mariantonieta:maria_2305@cluster0.z0wo6wx.mongodb.net/?retryWrites=true&w=majority";
mongoose.Promise = global.Promise
const app = express()
const PORT = 4000
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors:{
        origin: '*'
    }
})  
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/api', router)
io.on('connection', (socket) =>{
   console.log(socket.id)
   console.log("Client is connected")
   socket.on('message', (message, nickname) =>{
    socket.broadcast.emit('message',{
        body: message,
        from: nickname
    } )
   })
})

mongoose.connect(url, {useNewUrlParser: true}).then(() =>{
    console.log("Connection is successful")
    server.listen(PORT ,()=>{
        console.log('servidormejecutandose en ', PORT)
    })
})