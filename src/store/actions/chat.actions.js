import { chatService } from "../../services/chat/chat.service.js";
import { ADD_CHAT, SET_CURRENT_CHAT, UPDATE_CHAT } from "../reducers/chat.reducer";
import { SET_CHATS } from "../reducers/chat.reducer..js";
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
        return messages
    } catch (err) {
        console.log("Couldn't load messages");
        throw err
    }
}
export async function addNewMessage(message) {
    try {
        const response = await chatService.addMsg(message) // return {chat:...,message:....}
        const { chat } = response;
        (message.chatId) ? store.dispatch({ type: UPDATE_CHAT, chat }) : store.dispatch({ type: ADD_CHAT, chat })
        store.dispatch({ type: ADD_NEW_MSG, msg })
    } catch (err) {
        console.log("Couldn't add message");
        throw err
    }
}