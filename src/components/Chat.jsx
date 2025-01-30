import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';

const Chat = () => {
  const {targetUserId}=useParams();
  const [messages, setMessages]=useState([]);
  const [newMessage, setNewMessage] = useState("")
  const user=useSelector(store=>store.user)
  const userId=user?._id;

  useEffect(()=>{
    if(!user) return;

    const socket = createSocketConnection();
    socket.emit("joinChat",{firstName:user?.firstName, userId,targetUserId});
    socket.on("messageRecieved",({firstName,text})=>{
      console.log(firstName+" :"+ text);
      setMessages((messages)=>[...messages,{firstName,text}])
    })
    return ()=>{
      socket.disconnect();
    }
  },[userId,targetUserId])

  const handleSendMsg=()=>{
    const socket= createSocketConnection();
    socket.emit("sendMessage",{firstName:user?.firstName,userId,targetUserId,text:newMessage});
    setNewMessage("");
  }

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col rounded-xl bg-base-300">
    <h1 className="p-5 border-b border-gray-600 text-center text-xl">{user?.firstName} ⇄ {}</h1>
    <div className="flex-1 overflow-scroll p-5">
      {messages.map((msg, index) => {
        return (
          <div
            key={index}
            
          >
            <div className="chat-header">
              {msg.firstName}
              <time className="text-xs opacity-50">1 min ago</time>
            </div>
            <div className="chat-bubble">{msg.text}</div>
            <div className="chat-footer opacity-50">Seen</div>
          </div>
        );
      })}
    </div>
    <div className="p-5 border-t border-gray-600 flex items-center gap-2">
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 border border-gray-500 text-white rounded p-2"
      ></input>
      <button onClick={handleSendMsg} className="btn btn-primary">
        Send
      </button>
    </div>
  </div>
  )
}

export default Chat