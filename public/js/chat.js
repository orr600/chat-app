const socket =io()



const $formMessage=document.querySelector('#formMessage')
const $inputMessage=document.querySelector('input[name="messageInput"]')
const $sendLocation=document.querySelector('#sendLocation')
const $buttonMessage=document.querySelector('#buttonMessage')
const $messages=document.querySelector('#messages')

const messageTemplate=document.querySelector('#message-template').innerHTML
const loc_messageTemplate=document.querySelector('#loc-message-template').innerHTML
const sideBarTemplate=document.querySelector('#side-bar-template').innerHTML

const {username,roomname} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll= ()=>{
    const $newMessage= $messages.lastElementChild

    const newMessageStyles= getComputedStyle($newMessage)
    const newMessageMargin= parseInt(newMessageStyles.marginBottom)
    const newMessageHeight= $newMessage.offsetHeight+ newMessageMargin

    const containerHeight= $messages.scrollHeight

    const visibleHeight= $messages.offsetHeight

    const scrollOffSet= $messages.scrollTop+ visibleHeight

    if(containerHeight-newMessageHeight <= scrollOffSet ){
        $messages.scrollTop=$messages.scrollHeight 
    }
}
socket.on('message',(message,username)=>{
   
    const html = Mustache.render(messageTemplate, {
        text: message.text,
        createdAt: moment(message.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
        username
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on('locationMessage',(messageLoc,username)=>{
    
    const html = Mustache.render(loc_messageTemplate, {
        loc:messageLoc.url,
        createdAt: moment(messageLoc.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
        username
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})
socket.on('roomData',({room,users})=>{
    const html= Mustache.render(sideBarTemplate,{
        room,
        users
    })
    document.querySelector('.chat__sidebar').innerHTML=html
})


 
formMessage.addEventListener('submit', (e)=>{
    e.preventDefault()
    $buttonMessage.setAttribute('disabled','disabled')
    //const message= document.querySelector('input').value
    const message= e.target.elements.messageInput.value

    
    
    socket.emit('sendMessage',message,(mes)=>{
        $buttonMessage.removeAttribute('disabled')
        $inputMessage.value=''
        $inputMessage.focus()
        

    } )
})

$sendLocation.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('The chrome does not support geolocation')
    }
    $sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        
        const data= {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }
        socket.emit('sendLocation', data, ()=>{
            $sendLocation.removeAttribute('disabled')
            console.log("Location shared!")
        })

    })

})
socket.emit('join',{username,roomname},(error)=>{
    if (error){
       alert(error)
       location.href='/'
    }
})
