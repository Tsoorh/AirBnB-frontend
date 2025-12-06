export const SET_CHATS = 'SET_CHATS'
export const ADD_CHAT = 'ADD_CHAT'
export const UPDATE_CHAT = 'UPDATE_CHAT'
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT'
export const ADD_NEW_MSG = 'ADD_NEW_MSG'

const initialState = {
    chats: [],
    currentChat: '',
    currentMsgs: []
}

export function chatReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CHATS:
            return {
                ...state,
                chats: action.chats
            }
            break;
        case SET_CURRENT_CHAT:
            return {
                ...state,
                currentChat: action.currentChat
            }
            break;
        case ADD_NEW_MSG:
            return {
                ...state,
                currentMsgs: action.currentMsgs
            }
            break;
        case ADD_CHAT:
            return {
                ...state,
                chats: [...state.chats, action.chat]
            }
            break;
        case UPDATE_CHAT:
            return {
                ...state,
                chats: [state.chats.map(chat => (chat._id === action.chat._id) ? action.chat : chat)]
            }
            break;
        default:
            return state;
    }
}