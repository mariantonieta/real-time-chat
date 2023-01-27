import React from 'react'
import Icono from '../img/chat.jpg'
import io from 'socket.io-client'
import axios from 'axios'
import { useState, useEffect } from 'react'
 const socket = io('http://localhost:4000')
 const url = 'http://localhost:4000/api/'

const Chat = () => {
    const [nickname, setNickname] = useState('')
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [messages, setMessages] = useState([])
    const [storeMessages, setStoreMessages] = useState([])
    const [firstTime, setFirstTime] = useState(false)

    useEffect(() => {
        const receiveMessage = (message) =>{
            setMessage([message, ...messages])
        }
        socket.on('message', receiveMessage)
return() =>{
    socket.off('message', receiveMessage)
}
}, [messages]) 

if(!firstTime){
    axios.get(url + 'messages').then(res=> {
        setStoreMessages(res.data.messages)


    })
setFirstTime(true)
    
    }
    const nicknameSubmit  = (e) =>{
       e.preventDefault()
       setNickname(nickname)
       setDisabled(true) 
    }
    const handleSubmit = (e) =>{
        e.preventDefault()
        if(nickname !== ''){
            socket.emit('message', message, nickname)
            const newMessage ={
                body: message,
                from: 'Yo' 
            }
            setMessages([newMessage, ...messages])
            setMessage('')
            axios.post(url + 'save',{
                message: message,
                from: nickname
            })

        }else{
            alert('Para enviar un mensage debes establecer un nickname!!')
        }
    }

  return (

<div className='container mt-3'>
       <div>
       </div>
        <div className='card shadow border-0'>
            <div className='card-body'>
                <h5 className='text-center'>Real-Time Chat</h5>
        <img  src={Icono}></img>
            <form onSubmit={nicknameSubmit}>
                <div className='d-flex mb-3'>
                    <input type="text" className='form-control' placeholder='Nickname' id='nickname' onChange={e =>setNickname(e.target.value)} disabled={disabled} required/>
                    <button className='btn btn-success mx-3' type='submit' id='btn-nickname' disabled={disabled}>Log on</button>
                </div>
            </form>

            <form onSubmit={handleSubmit}>
                <div className='d-flex'>
                    <input type="text" className='form-control' placeholder='Message' id='message' onChange={e => setMessage(e.target.value)} value={message} />
                    <button className='btn btn-success mx-3' type='submit' id='btn-message'>Submit</button>
                </div>
            </form>
            </div>
        </div>

      <div className='card mt-3 mb-3 shadow border-0' id='content-chat'>
        <div className='card-body'>
            {
                messages.map((message, index) => (
                    <div key={index} className={`d-flex p-3 ${message.from === "Yo" ? "justify-content-end" : "justify-content-start"}`} >
       <div className={`card mb-3 border-1 ${message.from === "Yo" ? "bg-success bg-opacity-25" : "bg-light" }`}>
                     <div className="card-body">
                        <small className=''>{message.from} : {message.body}</small>
                        </div>  
                        </div>
                        </div>
                ))
            }
            <small className='text-center text-muted'>Saved messages</small>
            {
        storeMessages.map((message, index) => (
                    <div key={index} className={`d-flex p-3 ${message.from === nickname ? "justify-content-end" : "justify-content-start"}`} >
       <div className={`card mb-3 border-1 ${message.from === nickname ? "bg-success bg-opacity-25" : "bg-light" }`}>
                     <div className="card-body">
                        <small className='text-muted'>{message.from}: {message.message}</small>
                        </div>  
                        </div>
                        </div>
        ))
            }
            </div></div>  
            </div>
  )
}

export default Chat
