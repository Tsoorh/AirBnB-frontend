import axios from "axios"
import { httpService } from "../http.service"


export const chatService = {
    getChats,
    getMsgs,
    addMsg
}

//Filter contain: userId,participants,type(direct/group)
async function getChats(filterBy) {
    return await httpService.get(`conversation`, filterBy)
}

async function getMsgs(chatId) {
    return await httpService.get(`message/${chatId}`)
}

async function addMsg( msg) {
    return await httpService.post(`message`, msg)}