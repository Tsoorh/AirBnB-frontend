import { userService } from '../../services/user'

export const SET_USER = 'SET_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'
export const ADD_REVIEW = 'ADD_REVIEW'
export const UPDATE_USER = 'UPDATE_USER'
export const SET_WATCHED_USER = 'SET_WATCHED_USER'
export const SET_SCORE = 'SET_SCORE'


const initialState = {
    user: userService.getLoggedinUser(),
    users: [],
    watchedUser: null
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.user
            }
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }
        case SET_USERS:
            return {
                ...state,
                users: action.users
            }
        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => user._id === action.user._id ? action.user : user)
            }
        case ADD_REVIEW:
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.userId
                        ? { ...user, reviews: [...(user.reviews || []), action.review] }
                        : user
                )
            }
        case SET_WATCHED_USER:
            return {
                ...state,
                watchedUser: action.user
            }
        default:
            return state
    }

}
