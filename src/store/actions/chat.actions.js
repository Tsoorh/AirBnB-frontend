import { chatService } from "../../services/chat/chat.service.js";
import { ADD_CHAT, ADD_NEW_MSG, SET_CURRENT_CHAT, UPDATE_CHAT } from "../reducers/chat.reducer";
import { SET_CHATS } from "../reducers/chat.reducer.js";
import { store } from "../store.js";

export async function loadChats(userId) {
    try {
        const chatlist = await chatService.getChats(userId)
        store.dispatch({ type: SET_CHATS, chatlist })
    } catch (err) {
        console.log("Couldn't load chats");
        throw err
    }
}
export async function loadmessages(chatId) {
    try {
        const messages = await chatService.getMsgs(chatId)
        store.dispatch({ type: SET_CURRENT_CHAT, messages })
    } catch (err) {
        console.log("Couldn't load messages");
        throw err
    }
}
export async function findAndSetPrivateChat(userId1, userId2) {
    try {
        const participants = [userId1, userId2]
        const chat = await chatService.getChats(participants)
        if (!chat) return null
        await loadmessages(chat._id)
        return chat._id
    }catch(err){
        console.log("Couldn't get privateChat")
    }
}
export async function addNewMessage(message) {
    try {
        const response = await chatService.addMsg(message) // return {chat:...,message:....}
        const { chat } = response;
        (message.chatId) ? store.dispatch({ type: UPDATE_CHAT, chat }) : store.dispatch({ type: ADD_CHAT, chat })
        store.dispatch({ type: ADD_NEW_MSG, message })
    } catch (err) {
        console.log("Couldn't add message");
        throw err
    }
}