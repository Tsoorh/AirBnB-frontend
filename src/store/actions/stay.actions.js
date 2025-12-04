import { stayService } from '../../services/stay'
import { store } from '../store'
import { ADD_STAY, REMOVE_STAY, SET_STAYS, SET_STAY, UPDATE_STAY, ADD_STAY_MSG } from '../reducers/stay.reducer'


export async function loadStays(filterBy) {
    try {
        // 1. Get the URLSearchParams instance from the current URL's query string
        const currentUrlParams = new URLSearchParams(window.location.search);        
        // 2. Convert to a JavaScript object
        const currentParamsObject = Object.fromEntries(currentUrlParams);
        // console.log('currentParamsObject: ', currentParamsObject);

        const stays = await stayService.query(currentParamsObject)
        store.dispatch(getCmdSetStays(stays))
    } catch (err) {
        console.log('Cannot load stays', err)
        throw err
    }
}

export async function loadStay(stayId) {
    try {
        const stay = await stayService.getById(stayId)
        store.dispatch(getCmdSetStay(stay))
    } catch (err) {
        console.log('Cannot load stay', err)
        throw err
    }
}


export async function removeStay(stayId) {
    try {
        await stayService.remove(stayId)
        store.dispatch(getCmdRemoveStay(stayId))
    } catch (err) {
        console.log('Cannot remove stay', err)
        throw err
    }
}

export async function addStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        store.dispatch(getCmdAddStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot add stay', err)
        throw err
    }
}

export async function updateStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        store.dispatch(getCmdUpdateStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot save stay', err)
        throw err
    }
}

export async function addStayMsg(stayId, txt) {
    try {
        const msg = await stayService.addStayMsg(stayId, txt)
        store.dispatch(getCmdAddStayMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add stay msg', err)
        throw err
    }
}

export async function addReviewToStay(stay,review) {
    try {
        let stayToUpdate = {...stay,reviews:[...(stay.reviews||[]),review]}
        store.dispatch(getCmdUpdateStay(stayToUpdate))
        await reviewService.add(stay._id,review);
    } catch (err) {
        store.dispatch(getCmdUpdateStay(stay))
        console.log('Cannot add review to stay', err)
        throw err
    }
}
export async function removeReviewFromStay(stay,reviewId) {
    try {
        let updatedReviews = stay.reviews.filter(review=> review._id !== reviewId)
        let stayToUpdate = {...stay,reviews:updatedReviews}
        store.dispatch(getCmdUpdateStay(stayToUpdate))
        await reviewService.remove(stay._id,reviewId);
    } catch (err) {
        store.dispatch(getCmdUpdateStay(stay))
        console.log('Cannot remove review from stay', err)
        throw err
    }
}

// Command Creators:
function getCmdSetStays(stays) {
    return {
        type: SET_STAYS,
        stays
    }
}
function getCmdSetStay(stay) {
    return {
        type: SET_STAY,
        stay
    }
}
function getCmdRemoveStay(stayId) {
    return {
        type: REMOVE_STAY,
        stayId
    }
}
function getCmdAddStay(stay) {
    return {
        type: ADD_STAY,
        stay
    }
}
function getCmdUpdateStay(stay) {
    return {
        type: UPDATE_STAY,
        stay
    }
}
function getCmdAddStayMsg(msg) {
    return {
        type: ADD_STAY_MSG,
        msg
    }
}

// unitTestActions()
// async function unitTestActions() {
//     await loadStays()
//     await addStay(stayService.getEmptyStay())
//     await updateStay({
//         _id: 'm1oC7',
//         vendor: 'stay-Good',
//     })
//     await removeStay('m1oC7')
// }
