import { useEffect, useState } from "react"
import { chatService } from "../services/chat/chat.service.js"
import { ChatApp } from "./Chat"
import { useSelector } from "react-redux"
import { userService } from "../services/user"
import { useNavigate } from "react-router"

export function Messages() {
    const [chatList, setChatList] = useState([])
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    useEffect(() => {
        getChatList()
        FormatChatList()
    }, [])

    async function getChatList() {
        const chats = await chatService.getChats()
        setChatList(chats)
    }

    async function FormatChatList() {
        if (!chatList) return;

        const formattedChatPromises = chatList.map(async (chat) => {
            const participantNamesPromises = chat.participants
                .filter(participantId => participantId !== loggedInUser._id)
                .map(async (participantId) => {
                    const user = await userService.getById(participantId);
                    return user.fullname;
                });

            const participantsNames = await Promise.all(participantNamesPromises);

            return { ...chat, participantsNames };
        });

        const chatsToUpdate = await Promise.all(formattedChatPromises);
        setChatList(chatsToUpdate);
    }

    function onChooseChat(chatId) {
        navigate(`/messages/${chatId}`)
    }


    return (
        <section className="messages">
            <div className="chat-sec">
            <ul>
                <h2>chats</h2>
                {(!chatList) ? 'No chats to display' :
                    chatList.map((chat,idx) => {
                        if(!chat.lastMessage.text) return null
                        return <li key={idx} className="flex" onClick={()=>onChooseChat(chat._id)}><b>{chat?.participantsNames}</b> <span>{chat?.lastMessage?.text}</span></li>
                    })
                }
            </ul>
            </div>
            <div className="msg-sec">
            <ChatApp />
            </div>
        </section>
    )
}