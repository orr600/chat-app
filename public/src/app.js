const express= require("express")
const path= require("path")
const http= require("http")
const socketio= require("socket.io")
const filter= require("bad-words")
const {createMessage,createLocMessage}= require('./utils/message')
const {addUser,removeUser,getUser,getUsersInRoom}= require('./utils/users')

const app= express()
const server= http.createServer(app)
const io=socketio(server)


port=process.env.PORT || 3000
const publicDir= path.join(__dirname,"..")

app.use(express.static(publicDir))




io.on('connection',(socket)=>{
    console.log("herree")

    socket.on('join',({username, roomname},callback)=>{
        console.log(username,roomname)
        const {user,error} = addUser({id:socket.id,username , roomname})
        if(!user){
            return callback(error)
            
        }
        
        socket.join(user.roomname)
        socket.emit('message',createMessage("Welcome "+user.username+"!"), 'Admin')
        io.to(user.roomname).emit('roomData',{
            room:user.roomname,
            users: getUsersInRoom(user.roomname)
        })
        socket.broadcast.to(user.roomname).emit('message',createMessage(user.username+" has joined!"),'Admin')
        callback()
    })

    
    
    

    socket.on('sendMessage',(text, callback)=>{
            const filt= new filter()
            
            const user= getUser(socket.id)
            
            if(filt.isProfane(text)){
                return callback("sorry this word is profane")
            }
            io.to(user.roomname).emit('message',createMessage(text),user.username)
            callback("Delivered")
        })
            
    
    socket.on('sendLocation',(coords,callback)=>{
        const user= getUser(socket.id)
        io.to(user.roomname).emit('locationMessage',createLocMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`),user.username)
        callback()
    })




    socket.on('disconnect',()=>{
        const user= removeUser(socket.id)
        if(user){
            io.to(user.roomname).emit('message',createMessage(user.username+" has left!"),'Admin')
            io.to(user.roomname).emit('roomData',{
                room:user.roomname,
                users: getUsersInRoom(user.roomname)
            })
        }
    })
    
})

server.listen(port,()=>{
    console.log("Server is up on port "+ port)
})