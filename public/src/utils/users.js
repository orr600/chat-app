const users=[]


const addUser=({id,username,roomname})=>{
    username=username.trim().toLowerCase()
    roomname=roomname.trim().toLowerCase()

    if(!username || !roomname){
        return {
            error: "User name and room are required"
        }
    }

    const existingUser= users.find((user)=>user.username===username && user.roomname===roomname)
    if (existingUser){
        return {
            error: "Username is in use!"
        }
    }
    const user= {id,username,roomname}
    users.push(user)
    console.log(users)
    return {user}
}

const removeUser=(id)=>{
    const index= users.findIndex((user)=>user.id===id )
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    return users.find((user)=>{return user.id===id })
    
}

const getUsersInRoom=(roomname)=>{
    roomname=roomname.trim().toLowerCase()
    return users.filter((user)=>user.roomname===roomname )
}

/*const user={id:44, username:"or", roomname:"js"}
const user2={id:45, username:"or33", roomname:"js"}
addUser(user)
addUser(user2)
console.log(users)
console.log(getUser(user.id))*/
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}





