import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";

const Chat = () => {
  const { targetUserId } = useParams();

  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);

  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // 🔽 Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔽 Fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        dispatch(addConnections(res?.data?.data || []));
      } catch (err) {
        console.log(err);
      }
    };

    if (!connections || connections.length === 0) {
      fetchConnections();
    }
  }, []);

  // 🔽 Set target user safely
  useEffect(() => {
    if (!connections) return;

    const user = connections.find((x) => x._id === targetUserId);
    setTargetUser(user || null);
  }, [connections, targetUserId]);

  // 🔽 Fetch previous chat messages
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/chat/${targetUserId}`,
          { withCredentials: true }
        );

        const chatMsgs =
          res?.data?.messages?.map((msg) => ({
            firstName: msg?.senderId?.firstName,
            lastName: msg?.senderId?.lastName,
            text: msg?.text,
            time: msg?.updatedAt,
          })) || [];

        setMessages(chatMsgs);
      } catch (err) {
        console.log(err);
      }
    };

    if (targetUserId) {
      fetchChatMessages();
    }
  }, [targetUserId]);

  // 🔽 Socket lifecycle (single instance)
  useEffect(() => {
    if (!userId || !targetUserId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socketRef.current.on("messageRecieved", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, targetUserId]);

  // 🔽 Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔽 Send message
  const handleSendMsg = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        firstName: user?.firstName,
        lastName: user?.lastName,
        text: newMessage,
        time: new Date(),
      },
    ]);

    setNewMessage("");
  };

  // 🔽 Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMsg();
    }
  };

  return (
    <div className="w-11/12 md:w-1/2 mx-auto border border-gray-600 m-5 h-[71vh] flex flex-col rounded-xl bg-base-300">
      
      {/* Header */}
      <div className="flex items-center justify-center border-b p-3 gap-3">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img
              src={targetUser?.photoUrl}
              alt="User"
            />
          </div>
        </div>
        <h1 className="text-lg font-semibold">
          {targetUser?.firstName} {targetUser?.lastName}
        </h1>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const isMe = user?.firstName === msg?.firstName;

          return (
            <div
              key={index}
              className={`chat ${isMe ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header text-sm">
                {msg?.firstName}
                <span className="ml-2 text-xs opacity-50">
                  {msg?.time
                    ? new Date(msg.time).toLocaleTimeString()
                    : ""}
                </span>
              </div>
              <div className="chat-bubble">{msg?.text}</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 border border-gray-500 rounded px-3 py-2"
        />
        <button
          onClick={handleSendMsg}
          disabled={!newMessage.trim()}
          className="btn btn-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;




// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { createSocketConnection } from "../utils/socket";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { BASE_URL } from "../utils/constants";
// import { addConnections } from "../utils/connectionSlice";

// const Chat = () => {
//   const { targetUserId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const user = useSelector((store) => store.user);
//   const userId = user?._id;
//   const dispatch= useDispatch()

//   // const chatBodyRef = useRef(null);

//   // const scrollToBottom = () => {
//   //   chatBodyRef.current?.scrollIntoView({ behavior: "smooth" })
//   // }

//   const connections = useSelector((store) => store.connections);
//   const [targetUser, setTargetUser] = useState({});

//   const getTargetUser = () => {
//     const tUser = connections?.filter((x) => x._id === targetUserId);
//     setTargetUser(tUser);
//     // console.log(tUser);
//     // console.log(targetUser[0]?.firstName);
//   };

//   useEffect(() => {
//     getTargetUser();
//   }, []);


//   const fetchConnections = async () => {
//     try {
//       const res = await axios.get(BASE_URL + "/user/connections", {
//         withCredentials: true,
//       });
//       dispatch(addConnections(res?.data?.data));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchConnections();
//   }, []);

//   const fetchChatMessages = async () => {
//     const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
//       withCredentials: true,
//     });
//     // console.log(chat?.data?.messages);
//     const chatMsgs = chat?.data?.messages.map((msg) => {
//       return {
//         firstName: msg?.senderId?.firstName,
//         lastName: msg?.senderId?.lastName,
//         text: msg?.text,
//         time: msg?.updatedAt,
//       };
//     });
//     // console.log(chatMsgs);
//     setMessages(chatMsgs);
//   };

//   useEffect(() => {
//     fetchChatMessages();
//     // scrollToBottom();
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     const socket = createSocketConnection();
//     socket.emit("joinChat", {
//       firstName: user?.firstName,
//       userId,
//       targetUserId,
//     });
//     socket.on("messageRecieved", ({ firstName, lastName, text }) => {
//       // console.log(firstName+" :"+ text);
//       setMessages((messages) => [...messages, { firstName, lastName, text }]);
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, [userId, targetUserId]);

//   const handleSendMsg = () => {
//     const socket = createSocketConnection();
//     socket.emit("sendMessage", {
//       firstName: user?.firstName,
//       lastName: user?.lastName,
//       userId,
//       targetUserId,
//       text: newMessage,
//     });
//     setNewMessage("");

//     // document.getElementById("chat-body").scrollTo({
//     //   bottom:0,
//     //   behavior:"smooth"
//     // })
//   };

//   return (
//     <div className="w-11/12 md:w-1/2 mx-auto border border-gray-600 m-5 h-[71vh] flex flex-col rounded-xl bg-base-300">
//       <div className="flex justify-center border-b">
//         <div className="btn btn-ghost btn-circle avatar my-2">
//           <img
//             alt="User Photo"
//             // src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//             src={targetUser[0]?.photoUrl}
//             className="rounded-full y-4"
//           />
//         </div>
        
//         <div>
//           <h1 className="p-5 border-gray-600 text-center text-xl">
//             {targetUser[0]?.firstName} {" " + targetUser[0]?.lastName}{" "}
//           </h1>
//         </div>
        
//       </div>
//       <div className="flex-1 overflow-scroll p-5" id="chat-body">
//         {messages.map((msg, index) => {
//           return (
//             <div
//               key={index}
//               className={
//                 "chat " +
//                 (user?.firstName === msg?.firstName ? "chat-end" : "chat-start")
//               }
//             >
//               <div className="chat-header">
//                 {msg?.firstName}
//                 <time className="text-xs opacity-50 ml-1">{msg?.time?.toString().slice(0,10)} / {msg?.time?.toString().slice(11,16)} GMT</time>
//               </div>
//               <div className="chat-bubble">{msg?.text}</div>
//               {/* <div className="chat-footer opacity-50">Seen</div> */}
//             </div>
//           );
//         })}
//       </div>
//       <div className="p-2 md:p-5 border-t border-gray-600 flex items-center gap-2">
//         <input
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 border border-gray-500 text-white rounded p-2"
//         ></input>
//         <button onClick={handleSendMsg} className="btn btn-primary">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

