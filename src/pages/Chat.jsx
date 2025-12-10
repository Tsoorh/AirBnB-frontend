import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SET_TOPIC } from '../services/socket.service'
import { useLocation, useParams } from 'react-router'
import { chatService } from '../services/chat/chat.service'
import Avatar from '@mui/material/Avatar'
import { userService } from '../services/user'
// import { addNewMessage } from '../store/actions/chat.actions.js'


//ON NAVIGATING TO CHATAPP - send: chatId, participant/s with navigation.
export function ChatApp() {
    const [msg, setMsg] = useState('')
    const [msgs, setMsgs] = useState([])
    // const [isBotMode, setIsBotMode] = useState(false)
    // const chatId = useSelector(storeState => storeState.chatModule.chatId) 
    const { chatId } = useParams()
    const [usersInChat, setUsersInChat] = useState([])
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    // const botTimeoutRef = useRef()



    useEffect(() => {
        getMsgHistory()
        getUsersInChat()
        if (chatId) socketService.emit(SOCKET_EMIT_SET_TOPIC, chatId)
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg)
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg)
            // botTimeoutRef.current && clearTimeout(botTimeoutRef.current)
        }
    }, [chatId])

    async function getMsgHistory() {
        if (chatId) {
            const historyMsgs = await chatService.getMsgs(chatId)
            setMsgs(historyMsgs)
        }
    }
    async function getUsersInChat() {
        if (chatId) {
            const chat = await chatService.getChatById(chatId)
            if (!chat) return
            console.log("🚀 ~ getUsersInChat ~ chat:", chat)

            chat?.participants.forEach(async (userId) => {
                if (loggedInUser?._id !== userId) {
                    const user = await userService.getById(userId);
                    setUsersInChat(user?.fullname)
                }
            });
        }
    }
    // useEffect(() => {
    // socketService.emit(SOCKET_EMIT_SET_TOPIC, topic)
    // }, [topic])

    function addMsg(newMsg) {
        setMsgs(prevMsgs => [...prevMsgs, newMsg])
    }


    async function sendMsg(ev) {
        ev.preventDefault()

        const newMsg = {
            senderId: loggedInUser._id,
            text: msg,
            status: "sent",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        if (chatId) newMsg.chatId = chatId;
        socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg)
        // const newMsg = { from, txt: msg.txt }
        // socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg)
        // if (isBotMode) sendBotResponse()
        // for now - we add the msg ourself
        const msgToAdd = {
            ...newMsg,
            userDetails: {
                _id: loggedInUser._id,
                fullname: loggedInUser.fullname,
                imgUrl: loggedInUser.imgUrl
            }
        }
        addMsg(msgToAdd)
        setMsg('')
    }

    function handleFormChange(ev) {
        const { value } = ev.target
        setMsg(value)
    }
    if(!chatId) return 'No messages to show'
    return (
        <>
            {/* <h2 className='user-chat'>{usersInChat}</h2> */}
            <section className="chat">

                <form onSubmit={sendMsg}>
                    <input
                        type="text" value={msg} onChange={handleFormChange}
                        name="txt" autoComplete="off" />
                    <button>Send</button>
                </form>

                <ul>
                    {msgs.map((msg, idx) => (<li key={idx} className={`li-msg flex align-center ${(msg?.userDetails?._id === loggedInUser._id) ? 'align-left-chat' : 'align-right-chat'}`}><Avatar className="chat-avatar" alt="sender-avatar" src={msg?.userDetails?.imgUrl} />{(msg?.userDetails?._id === loggedInUser._id) ? msg?.userDetails?.fullname + ":" : ":" + msg?.userDetails?.fullname} <span>{msg?.text}</span></li>))}
                </ul>
            </section>
        </>
    )
}