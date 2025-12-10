import { useEffect, useState } from "react"
import { chatService } from "../services/chat/chat.service.js"
import { ChatApp } from "./Chat"
import { useSelector } from "react-redux"
import { userService } from "../services/user"
import { useNavigate, useParams } from "react-router"
import Skeleton from "react-loading-skeleton"
import { Avatar } from "@adobe/react-spectrum"

export function Messages() {
    const [chatList, setChatList] = useState([])
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const {chatId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadChats()
    }, [])

    async function loadChats() {
        const chats = await chatService.getChats({ userId: loggedInUser._id })

        const formattedChatPromises = chats.map(async (chat) => {
            const participantDataPromises = chat.participants
                .filter(pid => pid !== loggedInUser._id)
                .map(async (pid) => {
                    const user = await userService.getById(pid)
                    return {
                        fullname: user.fullname,
                        imgUrl: user.imgUrl,
                    }
                })

            const participantsData = await Promise.all(participantDataPromises)

            return {
                ...chat,
                participantsData
            }
        })

        const finalChats = await Promise.all(formattedChatPromises)
        setChatList(finalChats)
    }


    function onChooseChat(chatId) {
        navigate(`/messages/${chatId}`)
    }


    return (
        <section className="messages">
            <div className="chat-header">
                <h3>Messages</h3>
            </div>
            <div className="chat-sec">
                <ul>
                    {(!chatList) ? 'No chats to display' :
                        chatList.map((chat, idx) => {
                            if (!chat.lastMessage.text) return null
                            return <li key={idx} className={`flex ${chatId===chat._id?'active':''}`} onClick={() => onChooseChat(chat._id)}>
                                <img className="img-url" src={chat.participantsData[0]?.imgUrl} />
                                <div className="flex column">
                                    <span className="chat-with">{chat?.participantsData[0]?.fullname} </span>
                                    <span className="last-message">{chat?.lastMessage?.text}</span>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>
            <div className="msg-header">
                <h3>chat fullname</h3>
            </div>
            <div className="msg-sec">
                <ChatApp />
            </div>
        </section>
    )
}