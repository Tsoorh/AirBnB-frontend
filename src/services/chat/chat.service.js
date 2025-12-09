import axios from "axios"
import { httpService } from "../http.service"


export const chatService = {
    getChats,
    getMsgs,
    getChatById,
    getChatId
}

//Filter contain: userId,participants,type(direct/group)
async function getChats(filterBy={}) {
    return await httpService.post(`chat`, filterBy)
}

async function getChatById(chatId){
    return await httpService.get(`chat/${chatId}`)
}

async function getMsgs(chatId) {
    return await httpService.get(`message/${chatId}`)
}

async function getChatId(participants) {
    return await httpService.post(`chat/id`, participants)
}