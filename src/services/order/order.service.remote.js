import { httpService } from '../http.service'

export const orderService = {
    query,
    getById,
    save,
    remove,
    // addOrderMsg
}

async function query(filterBy = {         
        hostId: '',
        guestId: '',
        orderId: '',
    }) 
    {
    return httpService.get(`order`, filterBy)
}

function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

async function remove(orderId) {
    return httpService.delete(`order/${orderId}`)
}
async function save(order) {
    var savedOrder
    console.log('order from service:', order);
    
    if (order._id) {
        savedOrder = await httpService.put(`order/${order._id}`, order)
    } else {
        savedOrder = await httpService.post('order', order)
    }
    return savedOrder
}

// async function addOrderMsg(orderId, txt) {
//     const savedMsg = await httpService.post(`order/${orderId}/msg`, {txt})
//     return savedMsg
// }