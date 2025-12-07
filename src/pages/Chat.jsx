import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SET_TOPIC } from '../services/socket.service'
import { useLocation } from 'react-router'
import { addNewMessage } from '../store/actions/chat.actions.js'


//ON NAVIGATING TO CHATAPP - send: chatId, participant/s with navigation.
export function ChatApp() { 
    const [msg, setMsg] = useState('')
    // const [msgs, setMsgs] = useState([])
    // const [topic, setTopic] = useState('Love')
    // const [isBotMode, setIsBotMode] = useState(false)
    const location = useLocation()
    const chatId  = location.state?.chatId || null
    const participant  = location.state?.participant || null
    const storedMsgs = useSelector(storeState => storeState.chatModule.currentMsgs)
    console.log("🚀 ~ ChatApp ~ storedMsgs:", storedMsgs)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const botTimeoutRef = useRef()



    useEffect(() => {
        // socketService.on(SOCKET_EVENT_ADD_MSG, addMsg)
        return () => {
            // socketService.off(SOCKET_EVENT_ADD_MSG, addMsg)
            // botTimeoutRef.current && clearTimeout(botTimeoutRef.current)
        }
    }, [])

    // useEffect(() => {
    // socketService.emit(SOCKET_EMIT_SET_TOPIC, topic)
    // }, [topic])

    function addMsg(newMsg) {
        // setMsgs(prevMsgs => [...prevMsgs, newMsg])
    }

    function sendBotResponse() {
        // Handle case: send single bot response (debounce).
        // botTimeoutRef.current && clearTimeout(botTimeoutRef.current)
        // botTimeoutRef.current = setTimeout(() => {
        //     setMsgs(prevMsgs => ([...prevMsgs, { from: 'Bot', txt: 'You are amazing!' }]))
        // }, 1250)
    }

    async function sendMsg(ev) {
        ev.preventDefault()
        console.log("🚀 ~ sendMsg ~ loggedInUser:", loggedInUser)
        const newMsg = {
            senderId:loggedInUser._id,
            receiverId:[participant],
            text:msg,
            status:"pending",
            createdAt:new Date(),
            updatedAd:new Date(),
        }
        if(chatId) newMsg.chatId = chatId;

        await addNewMessage(newMsg);

        // const newMsg = { from, txt: msg.txt }
        // socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg)
        // if (isBotMode) sendBotResponse()
        // for now - we add the msg ourself
        // addMsg(newMsg)

    }

    function handleFormChange(ev) {
        const { value } = ev.target
        setMsg(value)
    }

    return (
        <section className="chat">
            {/* <h2>Lets Chat about {topic}</h2> */}

            {/* <section className="chat-options">
                <label>
                    <input type="radio" name="topic" value="Love"
                        checked={topic === 'Love'} onChange={({ target }) => setTopic(target.value)} />
                    Love
                </label>

                <label>
                    <input
                        type="radio" name="topic" value="Politics"
                        checked={topic === 'Politics'} onChange={({ target }) => setTopic(target.value)} />
                    Politics
                </label>

                <label>
                    <input type="checkbox" name="isBotMode" checked={isBotMode}
                        onChange={({ target }) => setIsBotMode(target.checked)} />
                    Bot Mode
                </label>
            </section> */}

            <form onSubmit={sendMsg}>
                <input
                    type="text" value={msg.txt} onChange={handleFormChange}
                    name="txt" autoComplete="off" />
                <button>Send</button>
            </form>

            <ul>
                {/* {storedMsgs.map((msg, idx) => (<li key={idx}>{msg.from}: {msg.txt}</li>))} */}
            </ul>
        </section>
    )
}