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
    const [currentChat, setCurrentChat] = useState(null)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const {chatId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadChats()
    }, [])

    async function loadChats() {
        const chats = await chatService.getChats({ userId: loggedInUser._id })
        console.log("🚀 ~ loadChats ~ chats:", chats)
        setChatList(chats)
    }

    useEffect(()=>{
        const currentUrlChat = chatList?.find(chat=>chat._id === chatId)
        setCurrentChat(currentUrlChat?.participantsData[0]?.fullname || "")
    },[chatId,chatList])


    function onChooseChat(chatId) {
        navigate(`/messages/${chatId}`)
    }

    function onSendMsg(newMsg,chatId){
        const {text,userDetails,updateAt} = newMsg;
        const {fullname} = userDetails;
        setChatList(prevChatList=>{
            const newChatList = prevChatList.map(chat=>{
                if(chat._id===chatId){
                    return {...chat,lastMessage:{text:text,createdAt:updateAt}}
                }else{
                    return chat
                }
            })
            return newChatList
        })
    }


    return (
        <section className="messages">
            <div className="chat-header">
                <h3>Messages</h3>
            </div>
            <div className="chat-sec">
                <ul>
                    {(!chatList || chatList.length === 0) ? 'No chats to display' :
                        chatList.map((chat, idx) => {
                            // Safety checks
                            if (!chat.participantsData || chat.participantsData.length === 0) {
                                console.warn('Chat missing participantsData:', chat)
                                return null
                            }
                            if (!chat.lastMessage?.text && chatId !== chat._id) return null

                            return <li key={idx} className={`flex ${chatId===chat._id?'active-chat':''}`} onClick={() => onChooseChat(chat._id, chat.participantsData[0].fullname)}>
                                <img className="img-url" src={chat.participantsData[0].imgUrl} alt={chat.participantsData[0].fullname} />
                                <div className="flex column chat-info">
                                    <span className="chat-with">{chat.participantsData[0].fullname}</span>
                                    <span className="last-message">{chat.lastMessage.text}</span>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>
            <div className="msg-header">
                <h3>{currentChat}</h3>
            </div>
            <div className="msg-sec">
                <ChatApp  onSendMsg={onSendMsg}/>
            </div>
        </section>
    )
}